import logging
from typing import Dict

from app.services.celery.task import CeleryTaskStatus
from app.services.celery.task_statuses import FAILURE, SUCCESS
from app.services.s3.connect import connect_to_s3
from app.services.s3.get_s3_paths import get_s3_paths
from app.services.s3.utils import extract_bucket_and_directory
from app.settings import settings
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="get_s3_paths")
def get_s3_paths_task(s3_url: str) -> Dict:
    """
    Celery task to retrieve file paths from an S3 bucket.

    Args:
        s3_url (str): The URL to the directory in S3 bucket.

    Returns:
        Dict: A dictionary containing the status of the task and, if successful,
            the categorized file paths. If the task fails, the dictionary includes
            an error message.
    """
    logger.info("Task started: retrieving file paths from S3")

    bucket, directory = extract_bucket_and_directory(s3_url)

    try:
        s3_client = connect_to_s3(
            settings.S3_ACCESS_KEY, settings.S3_SECRET_KEY, str(settings.S3_ENDPOINT)
        )
        file_paths = get_s3_paths(bucket, directory, s3_client)
        logger.info("File paths successfully retrieved from S3.")
        return CeleryTaskStatus(
            status=SUCCESS,
            file_paths={key: list(paths) for key, paths in file_paths.items()},
        ).dict()
    except Exception as e:
        logger.error(f"Task failed: {e}")
        return CeleryTaskStatus(status=FAILURE, reason=str(e)).dict()
