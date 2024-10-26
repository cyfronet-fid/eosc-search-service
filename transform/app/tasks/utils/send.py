"""A celery task for sending data to solr/s3"""

import json
import logging
from typing import Optional

import boto3
from pyspark.sql import DataFrame

from app.services.celery.task import CeleryTaskStatus
from app.services.celery.task_statuses import FAILURE, SUCCESS
from app.services.s3.send import send_spark_df as send_to_s3
from app.services.solr.collections import COL_UPLOAD_CONFIG
from app.services.solr.send import send_str_to_solr
from app.settings import settings
from app.tasks.utils.s3_paths import extract_after_bucket
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="send_data")
def send_data(
    prev_task_status: Optional[CeleryTaskStatus],
    df_transformed: DataFrame,
    collection_name: str,
    task_type: str,
    s3_client: Optional[boto3.client] = None,
    req_body: Optional[dict] = None,
    file_path: Optional[str] = None,
) -> CeleryTaskStatus:
    """Task to send data to solr/s3"""
    logger.info(
        "Starting data sending task for file: %s, collection: %s",
        file_path,
        collection_name,
    )

    if not prev_task_status or prev_task_status.get("status") != SUCCESS:
        error_reason = "Previous task failed or is missing."
        logger.error(error_reason)
        prev_task_status = CeleryTaskStatus(status=FAILURE, reason=error_reason).dict()
        return prev_task_status

    try:
        is_dump = task_type == "dump"
        send_data_to_services(
            df_transformed, collection_name, is_dump, req_body, s3_client, file_path
        )
        prev_task_status["status"] = SUCCESS
        return prev_task_status

    except Exception as e:
        logger.error("Error in send_data task: %s", str(e))
        prev_task_status["status"] = FAILURE
        prev_task_status["reason"] = str(e)
        return prev_task_status


def send_data_to_services(
    df_transformed: DataFrame,
    collection_name: str,
    is_dump: bool = False,
    req_body: Optional[dict] = None,
    s3_client: Optional[boto3.client] = None,
    file_path: Optional[str] = None,
) -> None:
    """Helper function to send data to S3 and/or Solr based on the task type and a configuration."""
    if collection_name == settings.GUIDELINE:
        json_dump = df_transformed.to_json(orient="records")
    else:
        json_data = df_transformed.toJSON().collect()
        json_dump = json.dumps([json.loads(line) for line in json_data])

    if is_dump:
        instances = req_body.get("instances", None)
        file_key = extract_after_bucket(file_path, req_body.get("dump_url", ""))

        if instances:
            solr_instance = next(
                (inst for inst in instances if inst.get("type") == "solr"), None
            )
            if solr_instance:
                solr_url = solr_instance.get("url")
                solr_collections = solr_instance[COL_UPLOAD_CONFIG][collection_name]
                send_str_to_solr(json_dump, solr_url, solr_collections, file_key)
                logger.info("%s successfully send to solr.", file_key)

            s3_instance = next(
                (inst for inst in instances if inst.get("type") == "s3"), None
            )
            if s3_instance:
                send_to_s3(
                    json_data, s3_client, s3_instance.get("s3_output_url"), file_key
                )
                logger.info("%s successfully send to s3", file_key)

    else:
        solr_collections = settings.COLLECTIONS[collection_name]["SOLR_COL_NAMES"]
        solr_url = str(settings.SOLR_URL)
        send_str_to_solr(json_dump, solr_url, solr_collections, None)
        logger.info("Data successfully sent to Solr collections: %s.", solr_collections)
