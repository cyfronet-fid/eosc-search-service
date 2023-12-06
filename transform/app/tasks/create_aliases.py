import logging
import requests
from typing import List

from app.transform.utils.loader import load_env_vars
from app.transform.schemas.properties.env import (
    SOLR_ADDRESS,
    SOLR_PORT,
)
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="create_aliases")
def create_aliases_task(aliases: List[str], collection_names: List[str]) -> None:
    """Celery task for creating or switching solr aliases"""
    logger.info(
        "Initiating alias creation or switching aliases in Solr collections for a single data iteration"
    )

    env_vars = load_env_vars()

    aliases.sort()
    collection_names.sort()

    for alias, collection in zip(aliases, collection_names):
        create_alias_url = (
            f"{env_vars[SOLR_ADDRESS]}:{env_vars[SOLR_PORT]}/solr/admin/collections?action=CREATEALIAS"
            f"&name={alias}&collections={collection}"
        )

        response = requests.post(create_alias_url)

        if response.status_code == 200:
            logger.info(
                f"{response.status_code} created or switched {alias=} for {collection=} successfully."
            )
        else:
            logger.error(
                f"{response.status_code} creation or switching {alias=} for {collection=} has filed."
            )
