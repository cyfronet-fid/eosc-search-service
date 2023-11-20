import requests
from typing import List

from app.transform.utils.loader import load_env_vars
from app.transform.schemas.properties.env import (
    SOLR_ADDRESS,
    SOLR_PORT,
)

env_vars = load_env_vars()


def get_configset_names() -> List[str]:
    """
    Get a list of existing Solr configsets.

    Returns:
        List[str]: A list of existing configset names.
    """
    configsets_url = (
        f"{env_vars[SOLR_ADDRESS]}:{env_vars[SOLR_PORT]}/solr/admin/configs?action=LIST"
    )
    response = requests.get(configsets_url)
    configsets = response.json().get("configSets", [])
    return configsets
