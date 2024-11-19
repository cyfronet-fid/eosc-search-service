import logging
from typing import List, Optional

import requests

from app.services.celery.task import CeleryTaskStatus
from app.services.celery.task_statuses import FAILURE, SUCCESS
from app.worker import celery

logger = logging.getLogger(__name__)


class CollectionDeletionFailed(Exception):
    """Exception raised when the deletion of a collection fails."""

    pass


@celery.task(name="delete_solr_collections_task")
def delete_solr_collections_task(
    solr_url: str,
    collection_names: List[str],
) -> dict:
    """Celery task for deleting solr collections"""
    logger.info(
        "Initiating the deletion of the Solr collection for a single data iteration"
    )

    try:
        for collection in collection_names:
            delete_collection_url = (
                f"{solr_url}solr/admin/" f"collections?action=DELETE&name={collection}"
            )

            response = requests.delete(delete_collection_url)

            if response.status_code == 200:
                logger.info(
                    f"{response.status_code} {collection=} deleted successfully."
                )
            else:
                logger.error(
                    f"{response.status_code} deleting {collection=} has filed."
                )
                raise CollectionDeletionFailed(
                    f"Failed to delete collection {collection}. Status code: {response.status_code}. Aborting task"
                )
        return CeleryTaskStatus(status=SUCCESS).dict()
    except Exception as e:
        return CeleryTaskStatus(status=FAILURE, reason=str(e)).dict()
