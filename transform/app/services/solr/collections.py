import requests
from typing import List

from app.transform.utils.loader import load_env_vars
from app.transform.schemas.properties.env import (
    SOLR_ADDRESS,
    SOLR_PORT,
)

env_vars = load_env_vars()


def get_collection_names() -> List[str]:
    """
    Get a list of existing Solr collections

    Returns:
        List[str]: A list of existing collection names
    """
    collections_url = f"{env_vars[SOLR_ADDRESS]}:{env_vars[SOLR_PORT]}/solr/admin/collections?action=LIST"
    response = requests.get(collections_url)
    collections = response.json().get("collections", [])
    return collections
