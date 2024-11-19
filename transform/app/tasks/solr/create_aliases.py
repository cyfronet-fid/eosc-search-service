import logging
from typing import List, Optional

import requests

from app.services.celery.task import CeleryTaskStatus
from app.services.celery.task_statuses import FAILURE, SUCCESS
from app.worker import celery

logger = logging.getLogger(__name__)


class AliasesCreationFailed(Exception):
    """Exception raised when the creation of a aliases fails."""

    pass


@celery.task(name="create_aliases")
def create_aliases_task(
    solr_url: str,
    aliases: List[str],
    collection_names: List[str],
) -> dict | None:
    """Celery task for creating or switching solr aliases"""
    logger.info(
        "Initiating alias creation or switching aliases in Solr collections for a single data iteration"
    )

    try:
        aliases.sort()
        collection_names.sort()

        for alias, collection in zip(aliases, collection_names):
            create_alias_url = (
                f"{solr_url}solr/admin/collections?action=CREATEALIAS"
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
                raise AliasesCreationFailed(
                    f"Failed to create/switch alias {alias}. Status code: {response.status_code}. Aborting task"
                )
        return CeleryTaskStatus(status=SUCCESS).dict()
    except Exception as e:
        return CeleryTaskStatus(status=FAILURE, reason=str(e)).dict()
