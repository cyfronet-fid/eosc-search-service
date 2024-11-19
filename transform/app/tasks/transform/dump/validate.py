"""A celery task for validating a data dump."""

import logging
from typing import Optional

from app.services.celery.task import CeleryTaskStatus
from app.services.celery.task_statuses import FAILURE, SUCCESS
from app.services.s3.connect import connect_to_s3
from app.services.s3.validate import (
    validate_files_extension,
    validate_s3_bucket_access,
    validate_s3_directory_access,
    validate_s3_directory_structure,
)
from app.settings import settings
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="validate_dump")
def validate_dump(prev_task_status: Optional[dict], req_body: dict) -> dict:
    """Task to validate the dump.
    Validation scope:
    - Access,
    - Dump folder structure,
    - Data types inside the dump, TODO
    - Extension of files"""
    logger.info("Validating dump...")

    dump_url = req_body.get("dump_url")
    instances = req_body.get("instances", [])

    instance_s3 = next((inst for inst in instances if inst.get("type") == "s3"), None)
    logger.info("instance_s3: %s", instance_s3)
    s3_client = connect_to_s3(
        settings.S3_ACCESS_KEY, settings.S3_SECRET_KEY, settings.S3_ENDPOINT
    )

    try:
        # 1. Validate access to S3
        validate_s3_bucket_access(s3_client, dump_url)

        if instance_s3:
            validate_s3_bucket_access(s3_client, instance_s3.get("s3_output_url"))

        # 2. Validate directory
        validate_s3_directory_access(s3_client, dump_url)

        # 3. Validate folder structure in the dump
        validate_s3_directory_structure(s3_client, dump_url)

        # 4. Validate file extensions
        validate_files_extension(s3_client, dump_url)

        logger.info("Dump validated successfully.")

        return CeleryTaskStatus(status=SUCCESS).dict()

    except Exception as e:
        return CeleryTaskStatus(status=FAILURE, reason=str(e)).dict()
