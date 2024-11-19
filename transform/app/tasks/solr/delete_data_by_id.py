import logging
from typing import Optional

import requests
from requests import ConnectionError as ReqConnectionError

from app.services.celery.task import CeleryTaskStatus
from app.services.celery.task_statuses import ABORTED, FAILURE, SUCCESS
from app.services.solr.utils import ids_mapping
from app.settings import settings
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="delete_data_by_id")
def delete_data_by_id(
    col_name: str,
    data: dict | list[dict],
    delete: bool = True,
) -> list[dict]:
    """Delete solr resource based on its ID"""
    raw_id = data[0]["id"] if col_name == "interoperability guideline" else data["id"]
    id_to_delete = ids_mapping(raw_id, col_name)

    if not delete:
        return [{"status": ABORTED, "record_id": id_to_delete}]

    solr_col_names = settings.COLLECTIONS[col_name]["SOLR_COL_NAMES"]

    results = []

    for s_col_name in solr_col_names:
        url = f"{settings.SOLR_URL}solr/{s_col_name}/update?commitWithin=100"
        try:
            req = requests.post(url, json={"delete": id_to_delete}, timeout=180)
            if req.status_code == 200:
                logger.info(
                    f"{req.status_code} deleting resources was successful. Data type={col_name}, solr_col={s_col_name}, IDs={id_to_delete}"
                )
                results.append(
                    {
                        "status": SUCCESS,
                        "solr_col": s_col_name,
                        "record_id": id_to_delete,
                    }
                )
            else:
                logger.error(
                    f"{req.status_code} deleting resources has failed. Data type={col_name}, solr_col={s_col_name}, IDs={id_to_delete}"
                )
                results.append(
                    {
                        "status": FAILURE,
                        "solr_col": s_col_name,
                        "record_id": id_to_delete,
                        "http_status_code": req.status_code,
                    }
                )

        except ReqConnectionError as e:
            logger.error(
                f"Connection failed {url=}. Deleting resources has failed. Data type={col_name}, solr_col={s_col_name}. Details: {e}"
            )
            results.append(
                {
                    "status": FAILURE,
                    "solr_col": s_col_name,
                    "record_id": id_to_delete,
                    "error": str(e),
                }
            )

    return results
