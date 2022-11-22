# pylint: disable=line-too-long, too-many-arguments, consider-using-with, invalid-name
"""Module to send data"""
import os
import shutil
from typing import Dict
import requests
from botocore.exceptions import ClientError
from transform.all_collection.spark.utils.loader import (
    COLLECTIONS,
    OUTPUT_PATH,
    SOLR_ADDRESS,
    SOLR_PORT,
    SOLR_COL_NAMES,
    SEND_TO_SOLR,
    SEND_TO_S3,
    S3_DUMP_NAME,
    S3_CLIENT,
    S3_BUCKET,
    CREATE_LOCAL_DUMP,
    LOCAL_DUMP_PATH,
    DATASET,
    PUBLICATION,
    SOFTWARE,
    OTHER_RP,
    TRAINING,
    SERVICE,
    DATASOURCE,
)
from transform.all_collection.spark.conf.logger import Log4J

SOLR = "SOLR"
S3 = "S3"
LOCAL_DUMP = "LOCAL_DUMP"

req_headers = {"Accept": "application/json", "Content-Type": "application/json"}
failed_files = {
    DATASET: {SOLR: [], S3: [], LOCAL_DUMP: []},
    PUBLICATION: {SOLR: [], S3: [], LOCAL_DUMP: []},
    SOFTWARE: {SOLR: [], S3: [], LOCAL_DUMP: []},
    OTHER_RP: {SOLR: [], S3: [], LOCAL_DUMP: []},
    TRAINING: {SOLR: [], S3: [], LOCAL_DUMP: []},
    SERVICE: {SOLR: [], S3: [], LOCAL_DUMP: []},
    DATASOURCE: {SOLR: [], S3: [], LOCAL_DUMP: []},
}


def send_data(
    env_vars: Dict,
    col_name: str,
    file: str,
    file_num: int,
    logger: Log4J,
) -> None:
    """Send data to appropriate places / create local dump"""
    if env_vars[SEND_TO_SOLR]:
        send_to_solr(env_vars, col_name, file, file_num, logger)

    if env_vars[SEND_TO_S3]:
        send_to_s3(env_vars, col_name, file, file_num, logger)

    if env_vars[CREATE_LOCAL_DUMP]:
        create_local_dump(env_vars, col_name, file, file_num, logger)


def send_to_solr(
    env_vars: Dict,
    col_name: str,
    file: str,
    file_num: int,
    logger: Log4J,
) -> None:
    """Send data to solr"""
    file_to_send = get_output_path(env_vars, col_name, file_num)

    solr_col_names = env_vars[COLLECTIONS][col_name][SOLR_COL_NAMES].split(" ")
    req_statuses = []

    for s_col_name in solr_col_names:
        url = f"{env_vars[SOLR_ADDRESS]}:{env_vars[SOLR_PORT]}/solr/{s_col_name}/update/json/docs"
        req = requests.post(url, data=open(file_to_send, "rb"), headers=req_headers)
        req_statuses.append(req.status_code)

    if any((status != 200 for status in req_statuses)):
        failed_files[col_name][SOLR].append(file)
        for num, status in enumerate(req_statuses):
            if status != 200:
                logger.error(
                    f"{col_name} - {file} failed to be sent to the Solr collection: {solr_col_names[num]}, status={status}"
                )


def send_to_s3(
    env_vars: Dict,
    col_name: str,
    file: str,
    file_num: int,
    logger: Log4J,
) -> None:
    """Send data to S3"""
    s3 = env_vars[S3_CLIENT]
    file_to_send_path = get_output_path(env_vars, col_name, file_num)
    file_to_send_name = file_to_send_path.split("/")[-1]
    s3_path = os.path.join(env_vars[S3_DUMP_NAME], col_name.lower(), file_to_send_name)

    try:
        s3.upload_file(
            Filename=file_to_send_path, Bucket=env_vars[S3_BUCKET], Key=s3_path
        )
    except ClientError as err:
        failed_files[col_name][S3].append(file)
        logger.error(f"{col_name} - {file} failed to be sent to the S3 - {err}")


def create_local_dump(
    env_vars: Dict,
    col_name: str,
    file: str,
    file_num: int,
    logger: Log4J,
) -> None:
    """Create local dump"""
    file_to_save = get_output_path(env_vars, col_name, file_num)
    destination_path = os.path.join(env_vars[LOCAL_DUMP_PATH], col_name.lower())

    try:
        shutil.move(file_to_save, destination_path)
    except TypeError:
        failed_files[col_name][LOCAL_DUMP].append(file)
        logger.error(f"{col_name} - {file} failed to be a part of the local dump")


def get_output_path(env_vars: Dict, col_name: str, file_num: int) -> str:
    """Rename the output file and get the path of the output file"""
    desired_file_name = str(file_num) + "_" + col_name.lower() + ".json"
    output_files = os.listdir(env_vars[OUTPUT_PATH])
    output_path = None

    for file in output_files:
        if ".json" in file and ".crc" not in file:
            output_path = os.path.join(env_vars[OUTPUT_PATH], desired_file_name)
            os.rename(os.path.join(env_vars[OUTPUT_PATH], file), output_path)
            break

    return output_path
