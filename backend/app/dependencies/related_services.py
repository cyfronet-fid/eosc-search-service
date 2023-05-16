# pylint: disable=logging-fstring-interpolation
"""Related services for interoperability guidelines logic"""
import logging

import httpx
from httpx import AsyncClient, ConnectError, ConnectTimeout

from app.config import RELATED_SERVICES_ENDPOINT
from app.recommender.router_utils.common import (
    RecommendationHttpError,
    SolrRetrieveError,
)
from app.solr.operations import get_item_by_pid

logger = logging.getLogger(__name__)


async def get_related_services_pids(
    client: AsyncClient,
    guideline_id: str,
) -> list[str]:
    """Get related services for interoperability guideline based on its ID"""
    try:
        response = await client.get(
            f"{RELATED_SERVICES_ENDPOINT}/{guideline_id}",
        )

        if response.status_code != 200:
            raise RelatedServicesError(
                http_status=response.status_code,
                message=f"Related services server status error: \n\n {response}",
            )

        parsed_response = response.json()
        return parsed_response

    except (ConnectError, ConnectTimeout) as e:
        raise RelatedServicesError(message="Connection error") from e


async def get_whole_related_services(client: AsyncClient, pids: list[str]):
    """Get whole services objects based on PID"""
    try:
        items = []
        for pid in pids:
            response = (await get_item_by_pid(client, "service", pid)).json()
            if not response:
                logger.warning(f"No related service with pid={pid}")
                continue

            item = response["doc"]
            items.append(item)
        return items

    except httpx.ConnectError as e:
        raise SolrRetrieveError("Connection Error") from e


class RelatedServicesError(RecommendationHttpError):
    """Error with related services"""

    def __repr__(self):
        return f"[Related services] {super().__repr__()}"
