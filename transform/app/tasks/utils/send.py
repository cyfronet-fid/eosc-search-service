"""A celery task for sending data to solr/s3"""

import logging
from typing import Optional

from app.services.celery.task import CeleryTaskStatus
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="send_data")
def send_data(prev_task_status: Optional[CeleryTaskStatus], req_body: dict) -> dict:
    """Task to send data to solr/s3"""
    logger.info("Sending data...")
    # TODO
    return CeleryTaskStatus(status="toBeImplemented").dict()
