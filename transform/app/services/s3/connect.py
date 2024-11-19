"""Connect to s3"""

import boto3
from boto3.session import Session


def connect_to_s3(access_key: str, secret_key: str, endpoint: str) -> boto3.client:
    """Connect to s3"""
    session = Session()

    s3_client = session.client(
        service_name="s3",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        endpoint_url=str(endpoint),
    )

    return s3_client
