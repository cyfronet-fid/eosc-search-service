"""Helper module to inject related services data into interoperability guileliens response"""

import asyncio
import copy
import logging
from typing import Optional

from httpx import AsyncClient, ConnectError, ConnectTimeout

from app.consts import ResourceType
from app.error_handling.exceptions import RelatedServicesError
from app.schemas.solr_response import Collection, RelatedService
from app.settings import settings
from app.solr.operations import get_item_by_pid

logger = logging.getLogger(__name__)


def _parse_categories(categories: list, unified_categories: Optional[list]) -> list:
    categories_set = set()
    for item in categories:
        try:
            categories_set.add(item.split(">")[1])
        except IndexError:
            pass
    if unified_categories:
        return list(categories_set.union(unified_categories))
    return list(categories_set)


async def _get_related_records_pids(client, ig_pid):
    try:
        response = await client.get(
            f"{settings.RELATED_SERVICES_ENDPOINT}/{ig_pid}",
        )
        if response.status_code != 200:
            logger.error("%s. %s", response.status_code, str(response))
            raise RelatedServicesError(
                status_code=response.status_code,
                detail=(
                    f"Related services for guideline {ig_pid} server status error: \n\n"
                    f" {response}"
                ),
            )
        return response.json()

    except (ConnectError, ConnectTimeout) as e:
        logger.error("%s", str(e))
        raise RelatedServicesError(detail="Connection error") from e


async def extend_ig_with_related_services(
    client: AsyncClient, docs: list[dict], scope: Optional[str] = None
):
    """Main function responsible for extending iteroperability guideline response
    with related services data
    """
    new_docs = []
    for doc in docs:
        if doc["type"] == ResourceType.GUIDELINE:
            related_services_pids = []
            try:
                related_services_pids = await _get_related_records_pids(
                    client, doc["id"]
                )
            except RelatedServicesError:
                logger.exception("Exception happened during _get_related_records_pids")
                related_services_pids = []
            finally:
                if related_services_pids:
                    doc["related_services"] = await _get_related_services(
                        client, related_services_pids, scope
                    )
                else:
                    doc["related_services"] = []
                new_docs.append(copy.deepcopy(doc))
        else:
            new_docs.append(copy.deepcopy(doc))

    return new_docs


async def _get_related_services(
    client: AsyncClient,
    related_services_pids: list[str],
    scope: Optional[str] = None,
):
    gathered_result = await asyncio.gather(
        *[_get_related_service(client, pid, scope) for pid in related_services_pids]
    )
    return [result for result in gathered_result if result]


async def _get_related_service(
    client,
    pid,
    scope: Optional[str] = None,
):
    response = await get_item_by_pid(
        client=client, collection=Collection.ALL_COLLECTION, item_pid=pid, scope=scope
    )

    if response and response.json()["response"]["docs"]:
        service = response.json()["response"]["docs"][0]
        unified_categories = service.get("unified_categories")
        service_obj = RelatedService(
            pid=service["pid"],
            best_access_right=service["best_access_right"],
            title=service["title"][0],
            resource_organisation=service["resource_organisation"],
            tagline=service["tagline"],
            joined_categories=_parse_categories(
                service["categories"],
                unified_categories,
            ),
            type=service["type"],
        )
        return service_obj
    return None
