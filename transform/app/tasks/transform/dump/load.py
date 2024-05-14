"""A celery task for loading a data dump."""

import logging
from typing import Optional

from app.services.celery.task import CeleryTaskStatus
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="load_dump")
def load_dump(prev_task_status: Optional[CeleryTaskStatus], s3_url: str) -> dict:
    """Task to load the dump"""
    logger.info("Loading dump...")
    # TODO
    return CeleryTaskStatus(status="toBeImplemented").dict()
