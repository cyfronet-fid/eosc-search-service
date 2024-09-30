import logging
import zipfile
from io import BytesIO

import boto3
from fastapi import HTTPException

from app.mappings.mappings import entity_mapping
from app.services.s3.utils import (
    check_missing_directories,
    check_s3_directory_or_zip_exists,
    check_zip_file_conflicts,
    extract_bucket_and_key,
    filter_system_files,
)
from app.settings import settings

logger = logging.getLogger(__name__)


def validate_s3_bucket_access(s3_client: boto3.client, s3_url: str) -> None:
    """Check if access to S3 bucket is granted."""
    bucket, _ = extract_bucket_and_key(s3_url)

    logger.info("Checking if access to S3 bucket %s is granted.", bucket)

    try:
        s3_client.head_bucket(Bucket=bucket)
        logger.info("Access to bucket %s granted.", bucket)
    except HTTPException as he:
        logger.error("Access to bucket %s denied. HTTPException: %s", bucket, he.detail)
        raise he
    except Exception as e:
        logger.error("Access to bucket %s denied. Error: %s", bucket, e)
        raise ValueError(
            "Access to bucket %s denied. Error: %s",
        )


def validate_s3_directory_access(s3_client: boto3.client, s3_url: str) -> None:
    """Check if access to S3 object is granted."""
    bucket, directory = extract_bucket_and_key(s3_url)

    logger.info("Checking if access to S3 object %s is granted.", s3_url)

    try:
        if not check_s3_directory_or_zip_exists(s3_client, bucket, directory):
            raise ValueError(f"Directory {directory} does not exist in bucket {bucket}")
        else:

            logger.info(
                "Access to directory %s in bucket %s granted.", directory, bucket
            )
    except HTTPException as he:
        logger.error(
            "Access to directory %s in bucket %s denied. HTTPException: %s",
            directory,
            bucket,
            he.detail,
        )
        raise he
    except Exception as e:
        error_message = (
            f"Access to directory {directory} in bucket {bucket} denied. Error: {e}"
        )
        logger.error(error_message)
        raise ValueError(error_message)


def validate_s3_directory_structure(s3_client: boto3.client, s3_url: str) -> None:
    """Check if S3 directory structure is valid."""

    bucket, directory = extract_bucket_and_key(s3_url)

    logger.info("Checking if S3 directory %s is valid.", directory)

    required_directories = [
        settings.DATASET,
        settings.OTHER_RP,
        settings.ORGANISATION,
        settings.PROJECT,
        settings.PUBLICATION,
        settings.SOFTWARE,
        settings.RESULT_ORGANISATION,
        settings.RESULT_PROJECT,
        settings.ORGANISATION_PROJECT,
    ]

    try:
        missing_directories = check_missing_directories(
            s3_client, bucket, directory, required_directories
        )
        zip_file_conflicts = check_zip_file_conflicts(
            s3_client, bucket, directory, required_directories
        )

        if zip_file_conflicts:
            conflicting_directories = ", ".join(zip_file_conflicts)
            error_message = f"Conflicting directories found: {conflicting_directories} exist both as directories and .zip files."
            logger.error(error_message)
            raise ValueError(error_message)

        if len(missing_directories) == len(required_directories):
            error_message = "None of the required directories exist in the S3 bucket."
            logger.error(error_message)
            raise ValueError(error_message)
        elif missing_directories:
            warning_message = (
                f"Missing required directories: {', '.join(missing_directories)}"
            )
            logger.warning(warning_message)

        if not missing_directories and not zip_file_conflicts:
            logger.info(
                "Directory %s structure is valid. All required directories are present in the S3 bucket %s.",
                directory,
                bucket,
            )
    except HTTPException as he:
        logger.error(
            "Access to directory %s in bucket %s denied. HTTPException: %s",
            directory,
            bucket,
            he.detail,
        )
        raise he
    except Exception as e:
        logger.error(
            "Unexpected error occurred while validating directory %s structure in bucket %s: %s",
            directory,
            bucket,
            e,
        )
        raise ValueError(
            "Unexpected error occurred while validating directory %s structure in bucket %s: %s",
            directory,
            bucket,
            e,
        )


def validate_files(files: list, valid_extensions: list, invalid_files: list) -> bool:
    """Helper function to validate files based on extensions."""
    has_valid_files = False
    for file in files:
        if any(file.endswith(ext) for ext in valid_extensions):
            has_valid_files = True
        elif not file.endswith("/"):
            invalid_files.append(file)
    return has_valid_files


def validate_files_in_directory(
    s3_client: boto3.client,
    bucket: str,
    prefix: str,
    valid_extensions: list,
    invalid_files: list,
) -> bool:
    """Validate if files in a directory have valid extensions."""
    try:
        response = s3_client.list_objects_v2(Bucket=bucket, Prefix=prefix)
        files = [
            obj["Key"] for obj in response.get("Contents", []) if "Contents" in response
        ]
        return validate_files(files, valid_extensions, invalid_files)
    except Exception as e:
        error_message = f"Error validating files in directory {prefix}: {e}"
        logger.error(error_message)
        raise ValueError(error_message)


def validate_files_in_zip(
    s3_client: boto3.client,
    bucket: str,
    zip_prefix: str,
    valid_extensions: list,
    invalid_files: list,
) -> bool:
    """Validate if files in a .zip file have valid extensions."""
    try:
        zip_obj = s3_client.get_object(Bucket=bucket, Key=zip_prefix)
        with zipfile.ZipFile(BytesIO(zip_obj["Body"].read())) as z:
            files = [
                zip_info.filename for zip_info in z.infolist() if not zip_info.is_dir()
            ]
            return validate_files(files, valid_extensions, invalid_files)

    except Exception as e:
        error_message = f"Error validating files in zip file {zip_prefix}: {e}"
        logger.error(error_message)
        raise ValueError(error_message)


def validate_files_extension(s3_client: boto3.client, s3_url: str) -> None:
    """Validate if directories contain .json or .json.gz files."""

    bucket, directory = extract_bucket_and_key(s3_url)

    logger.info(
        "Validating files in S3 directory %s for correct extensions.", directory
    )

    required_directories = [
        settings.DATASET,
        settings.OTHER_RP,
        settings.ORGANISATION,
        settings.PROJECT,
        settings.PUBLICATION,
        settings.SOFTWARE,
        settings.RESULT_ORGANISATION,
        settings.RESULT_PROJECT,
        settings.ORGANISATION_PROJECT,
    ]

    valid_extensions = [".json", ".json.gz"]
    missing_files, invalid_files = [], []

    try:
        for required_directory in required_directories:
            prefix = f"{directory}/{entity_mapping.get(required_directory, required_directory)}/"
            zip_prefix = f"{prefix.rstrip('/')}.zip"

            directory_has_valid_files = validate_files_in_directory(
                s3_client, bucket, prefix, valid_extensions, invalid_files
            )

            if not directory_has_valid_files:
                directory_has_valid_files = validate_files_in_zip(
                    s3_client, bucket, zip_prefix, valid_extensions, invalid_files
                )

            if not directory_has_valid_files:
                missing_files.append(required_directory)

        invalid_files = [file for file in invalid_files if filter_system_files(file)]

        if missing_files:
            logger.error(f"Missing files in S3 directory %s", missing_files)

        if invalid_files:
            logger.warning("Invalid files: %s in directory", invalid_files)

        if not missing_files and not invalid_files:
            logger.info(
                "All files in S3 directory %s have valid extensions.", directory
            )

    except HTTPException as he:
        logger.error(
            "Access to directory %s in bucket %s denied. HTTPException: %s",
            directory,
            bucket,
            he.detail,
        )
    except Exception as e:
        logger.error("An error occurred while validating files: %s", e)
        raise ValueError("An error occurred while validating files: %s", e)
