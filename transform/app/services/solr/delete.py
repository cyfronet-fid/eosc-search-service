# pylint: disable=line-too-long, logging-fstring-interpolation
"""Delete resource based on its ID"""
import json
import logging
import requests
from requests.exceptions import ConnectionError as ReqConnectionError
from app.transform.utils.loader import (
    ALL_COLLECTION,
    SOLR_ADDRESS,
    SOLR_PORT,
    SOLR_COL_NAMES,
    load_env_vars,
)
from app.transform.transformers.service import SERVICE_IDS_INCREMENTOR
from app.transform.transformers.data_source import DATA_SOURCE_IDS_INCREMENTOR
from app.transform.transformers.bundle import BUNDLE_IDS_INCREMENTOR
from app.transform.transformers.offer import OFFER_IDS_INCREMENTOR
from app.transform.transformers.provider import PROVIDER_IDS_INCREMENTOR

logger = logging.getLogger(__name__)


def delete_data_by_id(
    col_name: str,
    data: dict | list[dict],
) -> None:
    """Delete solr resource based on its ID"""
    raw_id = data["id"]
    id_to_delete = ids_mapping(raw_id, col_name)

    env_vars = load_env_vars()
    solr_col_names = env_vars[ALL_COLLECTION][col_name][SOLR_COL_NAMES]
    solr_col_names = solr_col_names.split(" ")

    for s_col_name in solr_col_names:
        url = f"{env_vars[SOLR_ADDRESS]}:{env_vars[SOLR_PORT]}/solr/{s_col_name}/update?commitWithin=100"
        try:
            req = requests.post(url, json={"delete": id_to_delete}, timeout=180)
            if req.status_code == 200:
                logger.info(
                    f"Deleting resources was successful. Data type={col_name}, solr_col={s_col_name}, IDs={id_to_delete}"
                )
            else:
                logger.error(
                    f"Deleting resources has failed. Data type={col_name}, solr_col={s_col_name}, IDs={id_to_delete}"
                )

        except ReqConnectionError as e:
            logger.error(
                f"Deleting resources has failed. Data type={col_name}, solr_col={s_col_name}. Connection error: {e}"
            )


def delete_data_by_type(col_name: str) -> None:
    """Delete solr resources based on their type"""
    query = {"delete": {"query": f'type:"{col_name}"'}}
    headers = {"Content-Type": "application/json"}

    env_vars = load_env_vars()
    solr_col_names = env_vars[ALL_COLLECTION][col_name][SOLR_COL_NAMES]
    solr_col_names = solr_col_names.split(" ")

    for s_col_name in solr_col_names:
        url = f"{env_vars[SOLR_ADDRESS]}:{env_vars[SOLR_PORT]}/solr/{s_col_name}/update?commitWithin=100"
        try:
            req = requests.post(
                url, data=json.dumps(query), headers=headers, timeout=180
            )
            if req.status_code == 200:
                logger.info(
                    f"Deleting resources was successful. Data type={col_name}, solr_col={s_col_name}"
                )
            else:
                logger.error(
                    f"Deleting resources has failed. Data type={col_name}, solr_col={s_col_name}"
                )

        except ReqConnectionError as e:
            logger.error(
                f"Deleting resources has failed. Data type={col_name}, solr_col={s_col_name}. Connection error: {e}"
            )


def ids_mapping(id_: int | str, col_name: str) -> str:
    """Map ids"""
    match col_name:
        case "service":
            return str(id_ + SERVICE_IDS_INCREMENTOR)
        case "data source":
            return str(id_ + DATA_SOURCE_IDS_INCREMENTOR)
        case "provider":
            return str(id_ + PROVIDER_IDS_INCREMENTOR)
        case "offer":
            return str(id_ + OFFER_IDS_INCREMENTOR)
        case "bundle":
            return str(id_ + BUNDLE_IDS_INCREMENTOR)
        case _:
            return id_
