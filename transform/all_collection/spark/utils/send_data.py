# pylint: disable=line-too-long, too-many-arguments, consider-using-with
"""Module to send data"""
import os
from typing import Dict
import requests
from transform.all_collection.spark.utils.loader import (
    OUTPUT_PATH,
    SOLR_ADDRESS,
    SOLR_PORT,
)
from transform.all_collection.spark.conf.logger import Log4J

solr_req_headers = {"Accept": "application/json", "Content-Type": "application/json"}


def send_to_solr(
    s_col_names: str,
    env_vars: Dict,
    failed_files: Dict,
    col_name: str,
    file: str,
    logger: Log4J,
) -> None:
    """Send data to solr"""
    req_statuses = []
    file_to_send = get_output_path(env_vars)
    if not file_to_send:
        return

    for s_col_name in s_col_names:
        url = f"{env_vars[SOLR_ADDRESS]}:{env_vars[SOLR_PORT]}/solr/{s_col_name}/update/json/docs"
        req = requests.post(
            url, data=open(file_to_send, "rb"), headers=solr_req_headers
        )
        req_statuses.append(req.status_code)

    if any((status != 200 for status in req_statuses)):
        failed_files[col_name].append(file)
        for num, status in enumerate(req_statuses):
            if status != 200:
                logger.error(
                    f"{col_name} - {file} failed to be sent to collection: {s_col_names[num]}"
                )


def get_output_path(env_vars: Dict) -> str:
    """Get the output file path"""
    output_files = os.listdir(env_vars[OUTPUT_PATH])
    file_to_send = None
    for file in output_files:
        if "part-00000" in file and ".crc" not in file:
            file_to_send = env_vars[OUTPUT_PATH] + "/" + file
            break

    return file_to_send
