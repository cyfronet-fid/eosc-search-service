"""A celery task for loading a data dump."""

import logging
from typing import Dict, Optional

from app.services.celery.task import CeleryTaskStatus
from app.services.celery.task_statuses import FAILURE, SUCCESS
from app.tasks.utils.s3_paths import get_s3_paths_task
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="load_dump")
def load_dump(prev_task_status: Optional[CeleryTaskStatus], s3_url: str) -> Dict:
    """Task to load the dump"""
    if prev_task_status and prev_task_status.get("status") == SUCCESS:
        logger.info("Loading dump...")

        logger.info("Getting S3 paths...")
        get_s3_paths_task(s3_url)
        logger.info("S3 paths retrieved")

        logger.info("Transforming...")
        # TODO TRANSFORM
        return CeleryTaskStatus(status=SUCCESS).dict()

    else:
        logger.error(
            "Invalid previous task status for loading dump: %s", prev_task_status
        )
        return CeleryTaskStatus(status=FAILURE).dict()
