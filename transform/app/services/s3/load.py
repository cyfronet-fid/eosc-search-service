import json
import logging
from io import BytesIO
from typing import Dict, List

import boto3

from app.services.s3.utils import (
    extract_bucket_and_key,
    list_files_in_zip,
    process_json_content,
    read_json_from_zip,
)

logger = logging.getLogger(__name__)


def load_file_from_s3(file_path: str, s3_client: boto3.client) -> List[Dict]:
    """
    Loads the file from S3 and returns its content as JSON object.

    Supports .json and .json.gz formats. Each line in the file is treated
    as a separate JSON document.
    """
    data = []
    try:
        bucket_name, key = extract_bucket_and_key(file_path)

        if ".zip/" in key:
            zip_key = key.split(".zip/")[0] + ".zip"

            s3_object = s3_client.get_object(Bucket=bucket_name, Key=zip_key)
            zip_content = BytesIO(s3_object["Body"].read())

            for zip_file_name in list_files_in_zip(zip_content):
                if zip_file_name in file_path:
                    if zip_file_name.endswith(".json") or zip_file_name.endswith(
                        ".json.gz"
                    ):
                        data.extend(read_json_from_zip(zip_content, zip_file_name))

        else:
            s3_object = s3_client.get_object(Bucket=bucket_name, Key=key)
            content = s3_object["Body"].read()
            data = process_json_content(content, file_path.endswith(".gz"))

        return data

    except json.JSONDecodeError as e:
        logger.error("JSON decoding failed for file: %s. Error: %s", file_path, e)
    except Exception as e:
        logger.error("Error loading file from S3: %s", e)
        raise e
