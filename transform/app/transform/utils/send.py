# pylint: disable=line-too-long, too-many-arguments, consider-using-with, invalid-name, logging-fstring-interpolation
"""Module to send data"""
import os
import shutil
import logging
import requests
from requests.exceptions import ConnectionError as ReqConnectionError
from botocore.exceptions import ClientError, EndpointConnectionError
from app.transform.schemas.properties.env import (
    ALL_COLLECTION,
    OUTPUT_PATH,
    OUTPUT_FORMAT,
    SOLR_PORT,
    SOLR_ADDRESS,
    SEND_TO_SOLR,
    SOLR_COL_NAMES,
    SEND_TO_S3,
    S3_BUCKET,
    S3_CLIENT,
    S3_DUMP_NAME,
    CREATE_LOCAL_DUMP,
    LOCAL_DUMP_PATH,
    DATASET,
    OTHER_RP,
    PUBLICATION,
    SOFTWARE,
    BUNDLE,
    DATASOURCE,
    GUIDELINE,
    OFFER,
    PROVIDER,
    SERVICE,
    TRAINING,
)

logger = logging.getLogger(__name__)

SOLR = "SOLR"
S3 = "S3"
LOCAL_DUMP = "LOCAL_DUMP"

req_headers = {"Accept": "application/json", "Content-Type": "application/json"}
failed_files = {
    PROVIDER: {SOLR: [], S3: [], LOCAL_DUMP: []},
    SERVICE: {SOLR: [], S3: [], LOCAL_DUMP: []},
    DATASOURCE: {SOLR: [], S3: [], LOCAL_DUMP: []},
    OFFER: {SOLR: [], S3: [], LOCAL_DUMP: []},
    BUNDLE: {SOLR: [], S3: [], LOCAL_DUMP: []},
    GUIDELINE: {SOLR: [], S3: [], LOCAL_DUMP: []},
    TRAINING: {SOLR: [], S3: [], LOCAL_DUMP: []},
    OTHER_RP: {SOLR: [], S3: [], LOCAL_DUMP: []},
    SOFTWARE: {SOLR: [], S3: [], LOCAL_DUMP: []},
    DATASET: {SOLR: [], S3: [], LOCAL_DUMP: []},
    PUBLICATION: {SOLR: [], S3: [], LOCAL_DUMP: []},
}


def send_data(
    env_vars: dict,
    col_name: str,
    file: str,
    file_num: int = 0,
) -> None:
    """Send data to appropriate places / create local dump"""
    if env_vars[SEND_TO_SOLR]:
        send_to_solr(env_vars, col_name, file, file_num)

    if env_vars[SEND_TO_S3]:
        send_to_s3(env_vars, col_name, file, file_num)

    if env_vars[CREATE_LOCAL_DUMP]:
        create_local_dump(env_vars, col_name, file, file_num)


def send_json_string_to_solr(
    data: str,
    env_vars: dict,
    col_name: str,
) -> None:
    """Send data to solr"""
    solr_col_names = env_vars[ALL_COLLECTION][col_name][SOLR_COL_NAMES]
    solr_col_names = solr_col_names.split(" ")

    for s_col_name in solr_col_names:
        url = f"{env_vars[SOLR_ADDRESS]}:{env_vars[SOLR_PORT]}/solr/{s_col_name}/update?commitWithin=100"
        try:
            req = requests.post(url, data=data, headers=req_headers, timeout=180)
            if req.status_code == 200:
                logger.info(f"{req.status_code} - {col_name}. Update was successful.")
            else:
                logger.error(
                    f"{req.status_code} - {col_name}. Update failed. Data has failed to be sent to Solr. Details: {req.json()}"
                )
        except ReqConnectionError as e:
            logger.error(
                f"503 - {col_name}. Update failed. Solr is not reachable. Full error={e}"
            )


def send_to_solr(
    env_vars: dict,
    col_name: str,
    file: str,
    file_num: int = 0,
) -> None:
    """Send data to solr"""
    file_to_send = get_output_path(env_vars, col_name, file_num)
    solr_col_names = env_vars[ALL_COLLECTION][col_name][SOLR_COL_NAMES]
    solr_col_names = solr_col_names.split(" ")
    req_statuses = []

    for s_col_name in solr_col_names:
        url = f"{env_vars[SOLR_ADDRESS]}:{env_vars[SOLR_PORT]}/solr/{s_col_name}/update/json/docs"
        try:
            req = requests.post(
                url, data=open(file_to_send, "rb"), headers=req_headers, timeout=180
            )
            if req.status_code != 200:
                logger.error(
                    f"Cyclic updated failed to be sent to solr. {col_name=} status={req.status_code}"
                )
            req_statuses.append(req.status_code)
        except ReqConnectionError:
            req_statuses.append(500)

    if any((status != 200 for status in req_statuses)):
        failed_files[col_name][SOLR].append(file)
        for num, status in enumerate(req_statuses):
            if status != 200:
                logger.error(
                    f"{col_name} - {file} failed to be sent to the Solr collection: {solr_col_names[num]}, status={status}"
                )


def send_to_s3(
    env_vars: dict,
    col_name: str,
    file: str,
    file_num: int = 0,
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
    except (ClientError, EndpointConnectionError) as err:
        failed_files[col_name][S3].append(file)
        logger.error(f"{col_name} - {file} failed to be sent to the S3 - {err}")


def create_local_dump(
    env_vars: dict,
    col_name: str,
    file: str,
    file_num: int = 0,
) -> None:
    """Create local dump"""
    file_to_save = get_output_path(env_vars, col_name, file_num)
    destination_path = os.path.join(env_vars[LOCAL_DUMP_PATH], col_name.lower())

    try:
        shutil.move(file_to_save, destination_path)
    except TypeError:
        failed_files[col_name][LOCAL_DUMP].append(file)
        logger.error(f"{col_name} - {file} failed to be a part of the local dump")


def get_output_path(env_vars: dict, col_name: str, file_num: int = 0) -> str:
    """Rename the output file and get the path of the output file"""
    _format = f".{env_vars[OUTPUT_FORMAT].lower()}"
    desired_file_name = str(file_num) + "_" + col_name.lower() + _format
    output_files = os.listdir(env_vars[OUTPUT_PATH])
    output_path = None
    for file in output_files:
        if _format in file and ".crc" not in file:
            output_path = os.path.join(env_vars[OUTPUT_PATH], desired_file_name)
            os.rename(os.path.join(env_vars[OUTPUT_PATH], file), output_path)
            break

    return output_path
