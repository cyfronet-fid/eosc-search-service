import logging
import requests
from typing import List

from app.worker import celery
from app.settings import settings

logger = logging.getLogger(__name__)


@celery.task(name="delete_solr_collections_task")
def delete_solr_collections_task(
    collection_names: List[str],
) -> None:
    """Celery task for deleting solr collections"""
    logger.info(
        "Initiating the deletion of the Solr collection for a single data iteration"
    )

    for collection in collection_names:
        delete_collection_url = (
            f"{settings.SOLR_URL}solr/admin/"
            f"collections?action=DELETE&name={collection}"
        )

        response = requests.delete(delete_collection_url)

        if response.status_code == 200:
            logger.info(f"{response.status_code} {collection=} deleted successfully.")
        else:
            logger.error(f"{response.status_code} deleting {collection=} has filed.")
