"""A celery task for transforming each type of data"""

import logging
from typing import Optional

import boto3
from pyspark.sql import DataFrame, SparkSession
from tqdm import tqdm

import app.transform.transformers as trans
from app.services.celery.task import CeleryTaskStatus
from app.services.celery.task_statuses import FAILURE, SUCCESS
from app.services.s3.connect import connect_to_s3
from app.services.s3.load import load_file_from_s3
from app.services.spark.config import apply_spark_conf
from app.settings import settings
from app.tasks.utils.save_error_log import save_error_log_to_json
from app.tasks.utils.send import send_data
from app.transform.transformers.base.base import BaseTransformer
from app.transform.utils.load import load_request_data
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="transform_data")
def transform_data(
    prev_task_status: Optional[CeleryTaskStatus], req_body: dict
) -> CeleryTaskStatus:
    """Celery task to transform each type of data"""
    if prev_task_status and prev_task_status.get("status") == SUCCESS:
        logger.info("Starting data transformation...")

        error_log = {collection: {} for collection in trans.transformers.keys()}

        try:
            s3_client = connect_to_s3(
                settings.S3_ACCESS_KEY,
                settings.S3_SECRET_KEY,
                str(settings.S3_ENDPOINT),
            )
            spark, _ = apply_spark_conf()

            for col_num, (collection_name, paths) in enumerate(
                tqdm(prev_task_status["file_paths"].items())
            ):
                if collection_name in trans.transformers.keys():
                    input_schema = settings.COLLECTIONS[collection_name]["INPUT_SCHEMA"]
                    transformer = trans.transformers.get(collection_name)

                    logger.info("started %s transformer", collection_name)

                    for file_num, file_path in enumerate(tqdm(paths)):
                        try:
                            df_transformed = transform_file(
                                file_path,
                                transformer,
                                spark,
                                s3_client,
                                collection_name,
                                input_schema,
                                error_log,
                            )

                            if df_transformed is None:
                                logger.warning(
                                    "%s file in %s collection failed to be transformed",
                                    file_path,
                                    collection_name,
                                )
                                continue

                            send_result = send_data(
                                prev_task_status=prev_task_status,
                                df_transformed=df_transformed,
                                collection_name=collection_name,
                                task_type="dump",
                                s3_client=s3_client,
                                req_body=req_body,
                                file_path=file_path,
                            )

                            if send_result.get("status") != SUCCESS:
                                return send_result

                            logger.info(
                                f"Successfully transformed and sent data for {collection_name} from {file_path}"
                            )

                        except Exception as e:
                            logger.error(
                                "Transformation failed for %s: %s", file_path, e
                            )
                            prev_task_status["status"] = FAILURE
                            prev_task_status["reason"] = (
                                f"Error transforming {file_path}: {e}"
                            )
                            return prev_task_status

            save_error_log_to_json(error_log)

            prev_task_status["status"] = SUCCESS
            return prev_task_status

        except Exception as e:
            logger.error(f"Transformation failed: {e}")
            prev_task_status["status"] = FAILURE
            prev_task_status["reason"] = f"Transformation process failed: {e}"
            return prev_task_status
    else:
        logger.error(
            "Invalid previous task status for transforming data: %s", prev_task_status
        )
        if prev_task_status is None:
            prev_task_status = CeleryTaskStatus(
                status=FAILURE, reason="Previous task status missing"
            ).dict()
        else:
            prev_task_status["status"] = FAILURE
            prev_task_status["reason"] = "Previous task failed"

        return prev_task_status


def transform_file(
    file_path: str,
    transformer: BaseTransformer,
    spark: SparkSession,
    s3_client: boto3.client,
    collection_name: str,
    input_schema: dict,
    error_log: dict,
) -> Optional[DataFrame]:
    """
    Transforms the data file using the specified transformer and logs errors if transformation fails.

    Args:
        file_path (str): Path to the file.
        transformer (BaseTransformer): Transformer to process the file.
        spark (SparkSession): Spark session object.
        s3_client (boto3.client): S3 client for loading data.
        collection_name (str): Collection name for logging.
        input_schema (dict): Input schema for loading data.
        error_log (dict): Dictionary to store transformation errors.

    Returns:
        Optional[DataFrame]: Transformed DataFrame or None if transformation fails.
    """
    try:
        logger.info("Loading file: %s, collections: %s", file_path, collection_name)
        data = load_file_from_s3(file_path, s3_client)
        logger.info("Loaded file: %s, collections: %s", file_path, collection_name)
        logger.info(
            "Transforming file: %s, collections: %s", file_path, collection_name
        )
        df = load_request_data(spark, data, input_schema, collection_name)
        df_trans = transformer(spark)(df)
        logger.info(
            "Transforming was successful file: %s, collections: %s",
            file_path,
            collection_name,
        )
        return df_trans
    except Exception as e:
        logger.error("Transformation failed for %s: %s", file_path, e)
        error_log[collection_name][file_path] = {"error": str(e)}

        return None
