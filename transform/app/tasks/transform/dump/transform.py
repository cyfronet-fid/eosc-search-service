"""A celery task for transforming each type of data"""

import logging
from typing import Optional

from tqdm import tqdm

import app.transform.transformers as trans
from app.services.celery.task import CeleryTaskStatus
from app.services.celery.task_statuses import FAILURE, SUCCESS
from app.services.s3.connect import connect_to_s3
from app.services.s3.load import load_file_from_s3
from app.services.spark.config import apply_spark_conf
from app.settings import settings
from app.transform.utils.load import load_request_data
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="transform_data")
def transform_data(prev_task_status: Optional[CeleryTaskStatus]) -> CeleryTaskStatus:
    """Celery task to transform each type of data"""
    if prev_task_status and prev_task_status.get("status") == SUCCESS:
        logger.info("Starting data transformation...")
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
                            data = load_file_from_s3(file_path, s3_client)
                            logger.info("loaded: %s", file_path)
                            df = load_request_data(
                                spark, data, input_schema, collection_name
                            )
                            df_trans = transformer(spark)(df)
                            logger.info("transformed: %s", file_path)

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
