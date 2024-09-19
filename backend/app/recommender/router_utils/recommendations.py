import datetime
import random
import uuid
from typing import Optional

import httpx
from async_lru import alru_cache
from httpx import AsyncClient

from app.consts import Collection
from app.recommender.router_utils.common import (
    RecommenderError,
    SolrRetrieveError,
    _get_panel,
)
from app.schemas.session_data import SessionData
from app.settings import settings
from app.solr.operations import get, search


async def get_recommended_uuids(
    client: AsyncClient,
    session: SessionData | None,
    collection: Collection,
    recommendation_visit_id: str,
):
    try:
        request_body = {
            "unique_id": session.session_uuid if session else str(uuid.uuid4()),
            "timestamp": datetime.datetime.utcnow().isoformat()[:-3] + "Z",
            "visit_id": recommendation_visit_id,
            "client_id": "search_service",
            "page_id": "/search/" + collection,
            "panel_id": _get_panel(collection),
            "candidates": {},
            "search_data": {},
        }

        if session is not None:
            request_body["aai_uid"] = session.aai_id

        response = await client.post(
            settings.RECOMMENDER_ENDPOINT,
            json=request_body,
        )

        if response.status_code != 200:
            raise RecommenderError(
                http_status=response.status_code,
                message=f"Recommender server status error: \n\n {response}",
            )

        parsed_response = response.json()
        if (
            "recommendations" not in parsed_response
            or len(parsed_response["recommendations"]) < 3
        ):
            raise RecommenderError(message="No recommendations provided")

        return parsed_response["recommendations"][:3]
    except httpx.ConnectError as e:
        raise RecommenderError(message="Connection error") from e


async def get_recommended_items(
    client: AsyncClient, uuids: list[str], scope: Optional[str] = None
):
    try:
        items = []
        for item_uuid in uuids:
            item = await get(client, Collection.ALL_COLLECTION, item_uuid, scope)
            items.append(item["doc"])
        return items
    except httpx.ConnectError as e:
        raise SolrRetrieveError("Connection Error") from e


# pylint: disable=unused-argument
@alru_cache(maxsize=512)
async def get_fixed_recommendations(
    collection: Collection,
    count: int = 3,
    scope: Optional[str] = None,
) -> list[str]:
    rows = 100
    if collection == Collection.DATA_SOURCE:
        collection = "data source"
    if collection == Collection.ALL_COLLECTION:
        collection = "publication"
    fq = [f'type:("{collection}")', 'language:"English"']
    async with httpx.AsyncClient() as client:
        response = await search(
            client,
            Collection.ALL_COLLECTION,
            q="*",
            qf="id",
            fq=fq,
            sort=["id desc"],
            rows=rows,
            exact="false",
            scope=scope,
        )
    docs: list = response.data["response"]["docs"]
    if len(docs) == 0:
        return []

    return [doc["id"] for doc in random.sample(docs, k=min(count, len(docs)))]
