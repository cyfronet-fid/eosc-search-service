# pylint: disable=line-too-long, logging-fstring-interpolation
"""Refresh solr collection"""
import logging
import requests
from requests.exceptions import ConnectionError as ReqConnectionError
from app.transform.utils.loader import (
    ALL_COLLECTION,
    SOLR_ADDRESS,
    SOLR_PORT,
    SOLR_COL_NAMES,
)

logger = logging.getLogger(__name__)


def refresh_collection(
    env_vars: dict,
    col_name: str,
) -> None:
    """Refresh solr collection - necessary after uploading data to apply changes"""
    solr_col_names = env_vars[ALL_COLLECTION][col_name][SOLR_COL_NAMES]
    solr_col_names = solr_col_names.split(" ")

    for s_col_name in solr_col_names:
        url = f"{env_vars[SOLR_ADDRESS]}:{env_vars[SOLR_PORT]}/solr/admin/collections?action=RELOAD&name={s_col_name}"
        try:
            req = requests.get(url, timeout=180)

            if req.status_code != 200:
                logger.error(
                    f"Refreshing collection has failed for collection={col_name}, solr_col={s_col_name}"
                )
        except ReqConnectionError:
            logger.error(
                f"Refreshing collection has failed for collection={col_name}, solr_col={s_col_name}"
            )
