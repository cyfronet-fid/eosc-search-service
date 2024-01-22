# pylint: disable=line-too-long, logging-fstring-interpolation
"""Delete resource based on its ID"""
import json
import logging
import requests
from requests.exceptions import ConnectionError as ReqConnectionError
from app.settings import settings

logger = logging.getLogger(__name__)


def delete_data_by_id(
    col_name: str,
    data: dict | list[dict],
) -> None:
    """Delete solr resource based on its ID"""
    raw_id = data["id"]
    id_to_delete = ids_mapping(raw_id, col_name)
    solr_col_names = settings.COLLECTIONS[col_name]["SOLR_COL_NAMES"]

    for s_col_name in solr_col_names:
        url = f"{settings.SOLR_URL}solr/{s_col_name}/update?commitWithin=100"
        try:
            req = requests.post(url, json={"delete": id_to_delete}, timeout=180)
            if req.status_code == 200:
                logger.info(
                    f"{req.status_code} deleting resources was successful. Data type={col_name}, solr_col={s_col_name}, IDs={id_to_delete}"
                )
            else:
                logger.error(
                    f"{req.status_code} deleting resources has failed. Data type={col_name}, solr_col={s_col_name}, IDs={id_to_delete}"
                )

        except ReqConnectionError as e:
            logger.error(
                f"Connection failed {url=}. Deleting resources has failed. Data type={col_name}, solr_col={s_col_name}. Details: {e}"
            )


def delete_data_by_type(col_name: str) -> None:
    """Delete solr resources based on their type"""
    query = {"delete": {"query": f'type:"{col_name}"'}}
    headers = {"Content-Type": "application/json"}
    solr_col_names = settings.COLLECTIONS[col_name]["SOLR_COL_NAMES"]

    for s_col_name in solr_col_names:
        url = f"{settings.SOLR_URL}solr/{s_col_name}/update?commitWithin=100"
        try:
            req = requests.post(
                url, data=json.dumps(query), headers=headers, timeout=180
            )
            if req.status_code == 200:
                logger.info(
                    f"{req.status_code} deleting resources was successful. Data type={col_name}, solr_col={s_col_name}"
                )
            else:
                logger.error(
                    f"{req.status_code} deleting resources has failed. Data type={col_name}, solr_col={s_col_name}"
                )

        except ReqConnectionError as e:
            logger.error(
                f"Connection failed {url=}. Deleting resources has failed. Data type={col_name}, solr_col={s_col_name}. Solr is not reachable. Details: {e}"
            )


def ids_mapping(id_: int | str, col_name: str) -> str:
    """Map ids"""
    match col_name:
        case "service":
            return str(id_ + settings.SERVICE_IDS_INCREMENTOR)
        case "data source":
            return str(id_ + settings.DATA_SOURCE_IDS_INCREMENTOR)
        case "provider":
            return str(id_ + settings.PROVIDER_IDS_INCREMENTOR)
        case "offer":
            return str(id_ + settings.OFFER_IDS_INCREMENTOR)
        case "bundle":
            return str(id_ + settings.BUNDLE_IDS_INCREMENTOR)
        case _:
            return id_
