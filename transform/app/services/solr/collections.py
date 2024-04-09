import logging
from typing import List

import requests

from app.settings import settings

logger = logging.getLogger(__name__)


def get_solr_collections_url(path: str) -> str:
    return f"{settings.SOLR_URL}solr/admin/collections?{path}"


def get_collection_names() -> List[str]:
    """
    Get a list of existing Solr collections

    Returns:
        List[str]: A list of existing collection names
    """
    collections_url = get_solr_collections_url("action=LIST")
    try:
        response = requests.get(collections_url)
        collections = response.json().get("collections", [])
        return collections

    except requests.RequestException as e:
        logging.error(f"Error getting Solr collections: Details: %s", e)
        raise


def get_pined_collections() -> List[str]:
    """
    Get a list of existing Solr collections pinned to aliases

    Returns:
        List[str]: A list of existing collection names pinned to aliases
    """
    aliases_url = get_solr_collections_url("action=LISTALIASES&wt=json")
    try:
        response = requests.get(aliases_url)
        collections_pined_list = list(response.json()["aliases"].values())
        return collections_pined_list

    except requests.RequestException as e:
        logging.error(
            "Error getting Solr collections pinned to aliases. Details: %s", e
        )
        raise
