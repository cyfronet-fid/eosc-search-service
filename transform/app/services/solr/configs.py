import logging
import requests
from typing import List

from app.transform.utils.loader import load_env_vars
from app.transform.schemas.properties.env import (
    SOLR_ADDRESS,
    SOLR_PORT,
)

logger = logging.getLogger(__name__)


def get_solr_configs_url(path: str) -> str:
    env_vars = load_env_vars()
    return f"{env_vars[SOLR_ADDRESS]}:{env_vars[SOLR_PORT]}/solr/admin/configs?{path}"


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
