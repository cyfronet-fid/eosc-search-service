import logging
from typing import Optional

import requests

from app.services.celery.task import CeleryTaskStatus
from app.services.celery.task_statuses import FAILURE, SUCCESS
from app.services.solr.validate.endpoints.validate import get_cols_names, validate
from app.worker import celery

logger = logging.getLogger(__name__)


class CollectionCreationFailed(Exception):
    """Exception raised when the creation of a collection fails."""

    pass


@celery.task(name="create_solr_collections_task")
def create_solr_collections_task(
    prev_task_status: Optional[CeleryTaskStatus],
    solr_url: str,
    all_collection_config: str,
    catalogue_config: str,
    organisation_config: str,
    project_config: str,
    provider_config: str,
    collection_prefix: str,
    date: str,
    num_shards: int,
    replication_factor: int,
) -> dict | None:
    """Celery task for creating solr collections"""
    logger.info("Creating solr collections...")

    collection_names = get_cols_names(collection_prefix, date)
    validate(
        all_collection_config,
        catalogue_config,
        organisation_config,
        project_config,
        provider_config,
        collection_names,
        date,
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
                f"{solr_url}solr/admin/collections?action=CREATE"
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
        prev_task_status["status"] = SUCCESS
        return prev_task_status
    except Exception as e:
        prev_task_status["status"] = FAILURE
        prev_task_status["reason"] = str(e)
        return prev_task_status
