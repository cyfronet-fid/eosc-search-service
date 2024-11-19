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
from app.tasks.utils.send import send_merged_data
from app.transform.transformers.base.base import BaseTransformer
from app.transform.utils.load import load_request_data
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="transform_data")
def transform_data(prev_task_status: dict, req_body: dict) -> dict:
    """Celery task to transform each type of data"""
    if not (prev_task_status and prev_task_status.get("status") == SUCCESS):
        logger.error(
            "Previous task failed or missing:  %s. Skipping transforming data...",
            prev_task_status,
        )
        return CeleryTaskStatus(
            status=FAILURE, reason="Previous task status failed or missing"
        ).dict()

    logger.info("Starting data transformation step...")
    error_log = {collection: {} for collection in trans.transformers.keys()}

    try:
        s3_client = connect_to_s3(
            settings.S3_ACCESS_KEY,
            settings.S3_SECRET_KEY,
            str(settings.S3_ENDPOINT),
        )
        spark, _ = apply_spark_conf()

        for collection_name, paths in tqdm(prev_task_status["file_paths"].items()):
            if collection_name in trans.transformers.keys():
                input_schema = settings.COLLECTIONS[collection_name]["INPUT_SCHEMA"]
                transformer = trans.transformers.get(collection_name)
                logger.info("Start to process %s collection", collection_name)

                # Handle merging
                merged_df, files = None, []

                for file_path in tqdm(paths):
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
                        if not df_transformed:
                            continue

                        # Merge logic
                        files.append(file_path)
                        merged_df = (
                            df_transformed
                            if merged_df is None
                            else merged_df.union(df_transformed)
                        )

                        if merged_df.count() >= req_body["records_threshold"]:
                            send_task_status = send_merged_data(
                                df=merged_df,
                                files=files,
                                collection_name=collection_name,
                                req_body=req_body,
                                s3_client=s3_client,
                                prev_task_status=prev_task_status,
                            )

                            if send_task_status.get("status") == SUCCESS:
                                logger.info(
                                    f"Successfully transformed and sent data for {collection_name}: {files=}"
                                )
                            else:
                                logger.error(
                                    f"Unsuccessful transforming and sending data for {collection_name}: {files=}"
                                )

                            merged_df, files = None, []
                        else:
                            logger.info(
                                f"Merging next file to satisfy %s minimum records, currently have %s",
                                req_body["records_threshold"],
                                merged_df.count(),
                            )

                    except Exception as e:
                        logger.error(
                            "Transforming data failure for file: %s, collection: %s: reason: %s",
                            file_path,
                            collection_name,
                            str(e),
                        )
                        continue

                # Send any remaining merged files
                if merged_df is not None:
                    send_merged_data(
                        df=merged_df,
                        files=files,
                        collection_name=collection_name,
                        req_body=req_body,
                        s3_client=s3_client,
                        prev_task_status=prev_task_status,
                    )

        save_error_log_to_json(error_log)

        return CeleryTaskStatus(status=SUCCESS).dict()
    except Exception as e:
        logger.error(f"Data transformation step has failed. Reason: {e}")
        return CeleryTaskStatus(status=FAILURE, reason=str(e)).dict()


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
        logger.debug("Loading file: %s, collections: %s", file_path, collection_name)
        data = load_file_from_s3(file_path, s3_client)
        logger.info("Loaded file: %s, collections: %s", file_path, collection_name)
        logger.debug(
            "Transforming file: %s, collections: %s", file_path, collection_name
        )
        df = load_request_data(spark, data, input_schema, collection_name)
        df_trans = transformer(spark)(df)
        if not df_trans:
            logger.error(
                "%s file in %s collection empty after transformation",
                file_path,
                collection_name,
            )
            return
        logger.info(
            "Transforming was successful file: %s, collections: %s",
            file_path,
            collection_name,
        )
        return df_trans
    except Exception as e:
        logger.error("Transformation failed for %s: %s", file_path, e)
        error_log[collection_name][file_path] = {"error": str(e)}
        return
