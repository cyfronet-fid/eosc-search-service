import logging
from typing import List

import requests

from app.settings import settings
from app.worker import celery

logger = logging.getLogger(__name__)


class CollectionCreationFailed(Exception):
    """Exception raised when the creation of a collection fails."""

    pass


@celery.task(name="create_solr_collections_task")
def create_solr_collections_task(
    all_collection_config: str,
    catalogue_config: str,
    organisation_config: str,
    project_config: str,
    provider_config: str,
    collection_names: List[str],
    num_shards: int,
    replication_factor: int,
) -> dict | None:
    """Celery task for creating solr collections"""
    logger.info(
        "Initiating the creation of Solr collections for a single data iteration"
    )

    try:
        for collection in collection_names:
            if collection.endswith("_catalogue"):
                config = catalogue_config
            elif collection.endswith("_organisation"):
                config = organisation_config
            elif collection.endswith("_project"):
                config = project_config
            elif collection.endswith("_provider"):
                config = provider_config
            else:
                config = all_collection_config

            create_collection_url = (
                f"{settings.SOLR_URL}solr/admin/collections?action=CREATE"
                f"&name={collection}&numShards={num_shards}&replicationFactor={replication_factor}"
                f"&collection.configName={config}&wt=json"
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
                raise CollectionCreationFailed(
                    f"Failed to create collection {collection}. Status code: {response.status_code}. Aborting task"
                )
        return {"status": "success"}
    except Exception as e:
        return {"status": "failure", "error": str(e)}
