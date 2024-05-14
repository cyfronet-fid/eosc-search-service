"""A celery task for validating a data dump."""

import logging
from typing import Optional

from fastapi import HTTPException

from app.services.celery.task import CeleryTaskStatus
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="validate_dump")
def validate_dump(prev_task_status: Optional[CeleryTaskStatus], s3_url: str) -> dict:
    """Task to validate the dump.
    Validation scope:
    - Access,
    - Dump structure,
    - Data types inside the dump,
    - Extension of files"""
    logger.info("Validating dump...")
    try:
        return CeleryTaskStatus(status="toBeImplemented").dict()

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except HTTPException as he:
        raise HTTPException(status_code=he.status_code, detail=str(he.detail))
