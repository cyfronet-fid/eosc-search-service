# pylint: disable=invalid-name, line-too-long, logging-fstring-interpolation
"""Send data"""
from logging import getLogger

import requests
from requests.exceptions import ConnectionError as ReqConnectionError

from eosc_pl.transform.utils.config import SOLR_EOSCPL_DATASET_COLS_NAME, SOLR_URL

logger = getLogger(__name__)


def send_json_string_to_solr(
    data: str,
    conf: dict,
) -> None:
    """Send data as a json string to solr"""
    for col_name in conf[SOLR_EOSCPL_DATASET_COLS_NAME].split(" "):
        url = f"{conf[SOLR_URL]}/solr/{col_name}/update?commitWithin=100"
        req_headers = {"Accept": "application/json", "Content-Type": "application/json"}

        try:
            req = requests.post(url, data=data, headers=req_headers, timeout=180)
            if req.status_code == 200:
                logger.info(
                    f"Solr update was successful. Collection name={col_name}, status={req.status_code}"
                )
            else:
                logger.error(
                    f"Solr update has failed. Collection name={col_name}, status={req.status_code}"
                )
        except ReqConnectionError as e:
            logger.error(
                f"Solr update has failed. Collection name={col_name}, error={e}"
            )
