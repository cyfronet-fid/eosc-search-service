import datetime
import random
import uuid

import httpx
from async_lru import alru_cache
from httpx import AsyncClient
from starlette.status import HTTP_200_OK

from app.config import RECOMMENDER_ENDPOINT
from app.routes.web.recommendation_utils.common import (
    RecommendationPanelId,
    RecommenderError,
    _get_panel,
    SolrRetrieveError,
)
from app.schemas.session_data import SessionData
from app.solr.operations import search, get


async def get_recommended_uuids(
    client: AsyncClient, session: SessionData | None, panel_id: RecommendationPanelId
):
    try:
        request_body = {
            "unique_id": session.session_uuid if session else str(uuid.uuid4()),
            "timestamp": datetime.datetime.utcnow().isoformat()[:-3] + "Z",
            "visit_id": str(uuid.uuid4()),
            "page_id": "/search/" + panel_id,
            "panel_id": _get_panel(panel_id),
            "candidates": [],  # TODO [#450] after changes in facade change [] -> {}
            "search_data": {},
        }

        if session is not None:
            request_body["aai_uid"] = session.aai_id

        response = await client.post(
            RECOMMENDER_ENDPOINT,
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


async def get_recommended_items(client: AsyncClient, uuids: list[str]):
    try:
        items = []
        for item_uuid in uuids:
            response = (await get(client, "all_collection", item_uuid)).json()
            item = response["doc"]
            if item is None:
                raise SolrRetrieveError(f"No item with id={item_uuid}")
            items.append(item)

        return items
    except httpx.ConnectError as e:
        raise SolrRetrieveError("Connection Error") from e


# pylint: disable=unused-argument
@alru_cache(maxsize=512)
async def get_fixed_recommendations(
    session_id: str | None, panel_id: RecommendationPanelId, count: int = 3
) -> list[str]:
    rows = 100
    if panel_id == "data-source":
        panel_id = "data source"
    if panel_id == "all":
        panel_id = "publication"
    fq = [f'type:("{panel_id}")']
    async with httpx.AsyncClient() as client:
        response = await search(
            client,
            "all_collection",
            q="*",
            qf="id",
            fq=fq,
            sort=["id desc"],
            rows=rows,
        )
    if response.status_code != HTTP_200_OK:
        return []
    docs: list = response.json()["response"]["docs"]
    if len(docs) == 0:
        return []

    return [doc["id"] for doc in random.sample(docs, k=min(count, len(docs)))]
