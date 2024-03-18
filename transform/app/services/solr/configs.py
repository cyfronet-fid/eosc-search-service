import logging
from typing import List

import requests

from app.settings import settings

logger = logging.getLogger(__name__)


def get_solr_configs_url(path: str) -> str:
    return f"{settings.SOLR_URL}solr/admin/configs?{path}"


def get_config_names() -> List[str]:
    """
    Get a list of existing Solr config sets.

    Returns:
        List[str]: A list of existing config set names.
    """
    configs_url = get_solr_configs_url("action=LIST")

    try:
        response = requests.get(configs_url)
        configs = response.json().get("configSets", [])
        return configs

    except requests.RequestException as e:
        logging.error("Error getting Solr config set names. Details: %s", e)
        raise
