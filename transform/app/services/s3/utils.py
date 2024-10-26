import gzip
import json
import logging
import re
import zipfile
from io import BytesIO
from typing import Generator, Optional

import boto3

from app.mappings.mappings import entity_mapping

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


def extract_bucket_and_key(file_path: str) -> tuple:
    """Extract bucket and key from the full S3 URL."""
    match = re.search(r"/files/([^/]+)/(.+)", file_path)

    if not match:
        logger.error(
            "Invalid S3 file path %s format. Expected format: /files/<bucket>/<key>",
            file_path,
        )
        raise ValueError(
            f"Invalid S3 file path format: {file_path}. Expected format: /files/<bucket>/<key>"
        )

    bucket = match.group(1)
    key = match.group(2).rstrip("/")

    return bucket, key


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


def list_files_in_zip(zip_content: BytesIO) -> Generator[str, None, None]:
    """
    Extract and yield the paths of valid files inside a ZIP archive.
    """
    with zipfile.ZipFile(zip_content) as z:
        for file_info in z.infolist():
            file_name = file_info.filename
            if not file_info.is_dir() and filter_system_files(file_name):
                parts = file_name.split("/")
                yield f"{parts[0]}.zip/{'/'.join(parts[:])}"


def process_json_content(content: bytes, is_gzipped: bool) -> list[dict]:
    """Process the JSON content, handling .gz and line-split JSON."""
    data = []
    if is_gzipped:
        with gzip.GzipFile(fileobj=BytesIO(content)) as gz:
            content_str = gz.read().decode("utf-8")
    else:
        content_str = content.decode("utf-8")

    json_objects = content_str.splitlines()
    for json_obj in json_objects:
        if json_obj.strip():
            try:
                data.append(json.loads(json_obj))
            except json.JSONDecodeError as e:
                logger.warning(f"JSON decoding failed for line: {json_obj}. Error: {e}")
                continue
    return data


def read_json_from_zip(zip_content: BytesIO, file_path: str) -> list[dict]:
    """
    Read and return JSON content from a specific file within a ZIP archive.
    """
    zip_file_name = file_path.split(".zip/")[1]
    logger.warning("file name %s", zip_file_name)
    with zipfile.ZipFile(zip_content) as z:
        with z.open(zip_file_name) as f:
            content = f.read()
            return process_json_content(content, zip_file_name.endswith(".gz"))
