"""A celery task for loading a data dump."""

import logging
from typing import Dict, Optional

from app.services.celery.task import CeleryTaskStatus
from app.services.celery.task_statuses import FAILURE, SUCCESS
from app.tasks.utils.s3_paths import get_s3_paths_task
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="load_dump")
def load_dump(prev_task_status: Optional[dict], s3_url: str) -> dict:
    """
    Celery task to load data from an S3 dump.

    Args:
        prev_task_status (Optional[CeleryTaskStatus]): Status of the previous task in the workflow,
            used to manage task dependencies and handle any errors or progress updates.
        s3_url (str): S3 URL where the dump is stored.

    Returns:
        CeleryTaskStatus: Status of the current task, including success or failure and any
        relevant progress information.
    """
    if prev_task_status and prev_task_status.get("status") == SUCCESS:
        logger.info("Loading dump...")

        logger.info("Getting S3 paths...")
        s3_paths_status = get_s3_paths_task(s3_url)
        if s3_paths_status.get("status") == SUCCESS:
            logger.info("S3 paths retrieved")

            prev_task_status["file_paths"] = s3_paths_status["file_paths"]

            prev_task_status["status"] = SUCCESS
            return prev_task_status

        else:
            logger.error("Failed to retrieve S3 paths")
            prev_task_status["status"] = FAILURE
            prev_task_status["reason"] = "Failed to retrieve S3 paths"
            return prev_task_status
    else:
        logger.error(
            "Invalid previous task status for loading dump: %s", prev_task_status
        )
        if prev_task_status is None:
            prev_task_status = CeleryTaskStatus(status=FAILURE).dict()
        else:
            prev_task_status["status"] = FAILURE
        return prev_task_status
