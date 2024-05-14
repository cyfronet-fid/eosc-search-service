"""A celery task for transforming each type of data"""

import logging
from typing import Optional

from app.services.celery.task import CeleryTaskStatus
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="transform_data")
def transform_data(prev_task_status: Optional[CeleryTaskStatus], data: dict) -> dict:
    """Task to transform each type of data"""
    logger.info("Transforming data...")
    # TODO

    # Invoke send task
    return CeleryTaskStatus(status="toBeImplemented").dict()
