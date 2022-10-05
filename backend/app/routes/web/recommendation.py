# pylint: disable=missing-function-docstring,no-else-return

""" Presentable items UI endpoint """
import datetime
import random
import uuid
from typing import Literal

import httpx
from fastapi import APIRouter, Depends
from httpx import AsyncClient

from app.config import RECOMMENDER_ENDPOINT
from app.generic.models.bad_request import BadRequest
from app.schemas.search_request import TermsFacet
from app.schemas.session_data import SessionData
from app.solr.operations import get, search
from app.utils.cookie_validators import cookie, verifier

router = APIRouter()


def _get_panel(panel_id: str) -> list[str]:
    # IMPORTANT!!! recommender does not support services
    if panel_id == "publication":
        return ["publications"]
    elif panel_id == "datasets":
        return ["datasets"]
    elif panel_id == "software":
        return ["software"]
    elif panel_id == "training":
        return ["trainings"]

    return []


async def _get_recommended_uuids(
    client: AsyncClient, session: SessionData, panel_id: str
):
    try:
        panel_id_options = ["publication", "datasets", "software", "training"]
        page_id = "/search/" + panel_id
        panels = (
            [random.choice(panel_id_options)]
            if panel_id == "all"
            else _get_panel(panel_id)
        )
        request_body = {
            "user_id": session.aai_id,
            "unique_id": session.session_uuid,
            "timestamp": datetime.datetime.utcnow().isoformat()[:-3] + "Z",
            "visit_id": str(uuid.uuid4()),
            "page_id": page_id,
            "panel_id": panels,
            "candidates": [],
            "search_data": {},
        }

        response = await client.post(
            RECOMMENDER_ENDPOINT,
            json=request_body,
        )

        if response.status_code != 200:
            return await _get_random_ids(client)

        recommendation_data = response.json()
        if len(recommendation_data) != 1:
            return await _get_random_ids(client)

        return recommendation_data[0]["recommendations"]
    except httpx.ConnectError:
        return await _get_random_ids(client)


async def _get_random_ids(client: AsyncClient):
    try:
        facets = {
            "id": TermsFacet(field="id", type="terms", limit=100),
        }
        response = await search(
            client=client,
            collection="all_collection",
            q="*",
            qf=["title"],
            fq=[],
            sort=["id asc"],
            rows=0,
            facets=facets,
        )

        buckets = response.json()["facets"]["id"]["buckets"]
        return random.sample([bucket["val"] for bucket in buckets], 3)
    except httpx.ConnectError:
        return []


async def _get_recommended_items(client: AsyncClient, uuids: list[str]):
    try:
        items = []
        for item_uuid in uuids:
            response = (await get(client, "all_collection", item_uuid)).json()
            item = response["doc"]
            items.append(item)

        return items
    except httpx.ConnectError:
        return []


@router.get(
    "/recommendations",
    dependencies=[Depends(cookie)],
    responses={500: {"model": BadRequest}},
)
async def get_recommendations(
    panel_id: Literal[
        "all", "publication", "datasets", "software", "training", "service"
    ],
    session: SessionData = Depends(verifier),
):
    async with httpx.AsyncClient() as client:
        uuids = await _get_recommended_uuids(client, session, panel_id)
        if not uuids:
            return []

        return await _get_recommended_items(client, uuids)
