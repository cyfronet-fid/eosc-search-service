import logging
from io import BytesIO
from typing import Dict, Generator

from app.mappings.mappings import entity_mapping
from app.services.s3.utils import is_exact_directory_match, list_files_in_zip
from app.settings import settings

logger = logging.getLogger(__name__)


def get_s3_paths(
    bucket_name: str, s3_directory: str, s3_client
) -> Dict[str, Generator[str, None, None]]:
    """
    Retrieve and categorize file paths from an S3 bucket.

    Args:
        bucket_name (str): The name of the S3 bucket.
        s3_directory (str): The directory within the S3 bucket to list files from.
        s3_client: An instance of an S3 client used to interact with the bucket.

    Returns:
        Dict[str, Generator[str, None, None]]: A dictionary where keys are entity types
        and values are generators yielding file paths for each entity type.

    Raises:
        Exception: If an error occurs during S3 operations.
    """
    files_dict = {
        key: []
        for key in (
            settings.DATASET,
            settings.OTHER_RP,
            settings.ORGANISATION,
            settings.PROJECT,
            settings.PUBLICATION,
            settings.SOFTWARE,
            settings.RESULT_ORGANISATION,
            settings.RESULT_PROJECT,
            settings.ORGANISATION_PROJECT,
        )
    }

    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=s3_directory)
        if "Contents" in response:
            for obj in response["Contents"]:
                file_key = obj["Key"]
                for key in files_dict.keys():
                    if is_exact_directory_match(
                        file_key, key, s3_directory
                    ) or is_exact_directory_match(
                        file_key, entity_mapping.get(key, key), s3_directory
                    ):
                        if file_key.endswith(".zip"):
                            zip_content = BytesIO(
                                s3_client.get_object(Bucket=bucket_name, Key=file_key)[
                                    "Body"
                                ].read()
                            )
                            files_dict[key] = [
                                f"{settings.S3_ENDPOINT}files/{bucket_name}/{s3_directory}/{zip_file}"
                                for zip_file in list_files_in_zip(zip_content)
                            ]
                        elif (
                            file_key
                            != f"{s3_directory}/{entity_mapping.get(key, key)}/"
                        ):
                            files_dict[key].append(
                                f"{settings.S3_ENDPOINT}files/{bucket_name}/{file_key}"
                            )
                        break
    except Exception as e:
        logger.error(f"Error retrieving files from S3: {e}")
        raise e
    finally:
        s3_client.close()

    return files_dict
