# pylint: disable=line-too-long, logging-fstring-interpolation
"""Refresh solr collection"""
import logging

import requests
from requests.exceptions import ConnectionError as ReqConnectionError

from app.settings import settings

logger = logging.getLogger(__name__)


def refresh_collection(
    col_name: str,
) -> None:
    """Refresh solr collection - necessary after uploading data to apply changes"""
    solr_col_names = settings.COLLECTIONS[col_name]["SOLR_COL_NAMES"]

    for s_col_name in solr_col_names:
        url = (
            f"{settings.SOLR_URL}solr/admin/collections?action=RELOAD&name={s_col_name}"
        )
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
