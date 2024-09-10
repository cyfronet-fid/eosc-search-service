import logging
import re
import zipfile
from io import BytesIO
from typing import Generator, Optional

import boto3

from app.mappings.mappings import entity_mapping
from app.settings import settings

logger = logging.getLogger(__name__)


def check_missing_directories(
    s3_client: boto3.client, bucket: str, directory: str, required_directories: list
) -> list:
    """Check for missing directories."""
    missing_directories = []
    for required_directory in required_directories:
        prefix = (
            f"{directory}/{entity_mapping.get(required_directory, required_directory)}/"
        )
        zip_prefix = prefix.rstrip("/") + ".zip"
        if not check_s3_directory_or_zip_exists(s3_client, bucket, prefix, zip_prefix):
            missing_directories.append(required_directory)
    return missing_directories


def check_s3_directory_or_zip_exists(
    s3_client: boto3.client,
    bucket: str,
    directory: str,
    zip_prefix: Optional[str] = None,
) -> bool:
    """Helper function to check if a directory or zip file exists."""
    try:
        response = s3_client.list_objects_v2(Bucket=bucket, Prefix=directory)
        directory_exists = "Contents" in response and any(
            obj["Key"].startswith(directory) for obj in response["Contents"]
        )

        if not directory_exists and zip_prefix:
            zip_response = s3_client.list_objects_v2(Bucket=bucket, Prefix=zip_prefix)
            return "Contents" in zip_response and any(
                obj["Key"] == zip_prefix for obj in zip_response["Contents"]
            )

        return directory_exists
    except Exception as e:
        error_message = f"Error checking existence of {directory=} or {zip_prefix=} in {bucket=}: {e}"
        logger.error(error_message)


def check_zip_file_conflicts(
    s3_client: boto3.client, bucket: str, directory: str, required_directories: list
) -> list:
    """Check for zip file conflicts."""
    zip_file_conflicts = []
    for required_directory in required_directories:
        prefix = (
            f"{directory}/{entity_mapping.get(required_directory, required_directory)}/"
        )
        zip_prefix = f"{prefix.rstrip('/')}.zip"
        if check_s3_directory_or_zip_exists(
            s3_client, bucket, prefix
        ) and check_s3_directory_or_zip_exists(s3_client, bucket, zip_prefix):
            zip_file_conflicts.append(required_directory)
    return zip_file_conflicts


def extract_bucket_and_directory(s3_url: str) -> tuple:
    """Extract bucket and directory from the full S3 URL."""
    if not s3_url.startswith(str(settings.S3_ENDPOINT)):
        logger.error(
            "The provided URL does not match the endpoint: %s.", settings.S3_ENDPOINT
        )
        raise ValueError(
            f"The provided URL does not match the endpoint: {settings.S3_ENDPOINT}"
        )

    url_path = s3_url.replace(str(settings.S3_ENDPOINT), "")
    logger.warning(url_path)
    match = re.match(r"files/([^/]+)/(.+)", url_path)

    if not match:
        logger.error(
            "Invalid S3 URL %s format. Expected format: /files/<bucket>/<directory>",
            s3_url,
        )
        raise ValueError(
            "Invalid S3 URL %s format. Expected format: /files/<bucket>/<directory>",
            s3_url,
        )

    bucket = match.group(1)
    directory = match.group(2).rstrip("/")

    return bucket, directory


def filter_system_files(file_name: str) -> bool:
    """
    Determine if a file is a system file based on its name. Filter out system files like '__MACOSX' and '.DS_Store'.
    """
    system_file_patterns = {"__MACOSX", ".DS_Store", "Thumbs.db", "desktop.ini"}
    return not any(pat in file_name for pat in system_file_patterns)


def is_exact_directory_match(file_key: str, target_key: str, directory: str) -> bool:
    """
    This function checks if the file_key matches the target_key directory exactly
    or if the target_key is a .zip file.
    """
    # Case 1: Exact directory match with trailing slash
    if file_key.startswith(f"{directory}/{target_key}") and (
        file_key == f"{directory}/{target_key}"
        or file_key[len(f"{directory}/{target_key}")] == "/"
    ):
        return True
    # Case 2: Match with .zip file at the end
    if file_key == f"{directory}/{target_key}.zip":
        return True
    return False


def list_files_in_zip(
    zip_content: BytesIO, zip_file_name: str
) -> Generator[str, None, None]:
    """
    Extract and yield the paths of valid files inside a ZIP archive.
    """
    with zipfile.ZipFile(zip_content) as z:
        for file_info in z.infolist():
            file_name = file_info.filename
            if not file_info.is_dir() and filter_system_files(file_name):
                yield f"{zip_file_name}/{file_name}"
