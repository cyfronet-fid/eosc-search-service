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


@celery.task(name="create_solr_collections_task")
def create_solr_collections_task(
    all_collection_config: str,
    provider_config: str,
    collection_names: List[str],
    num_shards: int,
    replication_factor: int,
) -> None:
    """Celery task for creating solr collections"""
    logger.info(
        "Initiating the creation of Solr collections for a single data iteration"
    )

    env_vars = load_env_vars()

    for collection in collection_names:
        config = (
            provider_config
            if collection.endswith("_provider")
            else all_collection_config
        )

        create_collection_url = (
            f"{env_vars[SOLR_ADDRESS]}:{env_vars[SOLR_PORT]}/solr/admin/collections?action=CREATE"
            f"&name={collection}&numShards={num_shards}&replicationFactor={replication_factor}"
            f"&collection.configName={config}&wt=xml"
        )

        response = requests.post(create_collection_url)

        if response.status_code == 200:
            logger.info(
                f"{response.status_code} {collection=} created successfully. {config=}"
            )
        else:
            logger.error(
                f"{response.status_code} creating {collection=} has filed. {config=}"
            )
