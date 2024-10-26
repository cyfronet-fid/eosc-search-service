import gzip
import io
import logging
import re

import boto3
from botocore.exceptions import ClientError, EndpointConnectionError

from app.services.s3.utils import extract_bucket_and_key

logger = logging.getLogger(__name__)


def send_spark_df(
    json_data: list[str], s3: boto3.client, s3_url: str, key: str
) -> None:
    """
    Compresses JSON data and uploads it to an S3 bucket.

    Args:
        json_data (List[str]): List of JSON lines to be uploaded.
        s3 (boto3.client): Boto3 S3 client.
        s3_url (str): The S3 URL (bucket) where data is to be stored.
        key (str): Key path (filename) for the object.

    Raises:
        ClientError: If there is an error during the S3 upload.
        EndpointConnectionError: If there is a connectivity issue with the S3 endpoint.
    """
    bucket, _ = extract_bucket_and_key(s3_url)
    compressed_data = io.BytesIO()
    with gzip.GzipFile(fileobj=compressed_data, mode="wb") as gz:
        gz.write("\n".join(json_data).encode("utf-8"))
    compressed_data.seek(0)
    if key.endswith(".json"):
        key += ".gz"
    key = re.sub(r"(.*\.zip/|.*\.tar/)", "", key)

    try:
        s3.upload_fileobj(
            Fileobj=compressed_data,
            Bucket=bucket,
            Key=key,
        )
        logger.info(f"{key} successfully uploaded to bucket {bucket}.")
    except (ClientError, EndpointConnectionError) as err:
        # TODO failed_files[col_name][S3].append(file)
        logger.error(f"{key} failed to be sent to the S3 - {err}")
