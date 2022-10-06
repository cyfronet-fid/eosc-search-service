# pylint: disable=missing-function-docstring

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
from app.schemas.session_data import SessionData
from app.solr.operations import get
from app.utils.cookie_validators import cookie, verifier

router = APIRouter()


def _get_panel(panel_id: str) -> list[str] | None:
    # IMPORTANT!!! recommender does not support services
    panel_id_options = ["publication", "dataset", "software", "training"]
    match panel_id:
        case "all":
            return [random.choice(panel_id_options)]
        case "publication":
            return ["publications"]
        case "dataset":
            return ["datasets"]
        case "software":
            return ["software"]
        case "training":
            return ["trainings"]
        case _:
            return None


async def _get_recommended_uuids(
    client: AsyncClient, session: SessionData, panel_id: str
):
    try:
        page_id = "/search/" + panel_id
        panels = _get_panel(panel_id)
        if not panels:
            return None

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
            return None

        recommendation_data = response.json()
        if len(recommendation_data) != 1:
            return None
        return recommendation_data[0]["recommendations"]
    except httpx.ConnectError:
        return None


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
        "all", "publication", "dataset", "software", "training", "service"
    ],
    session: SessionData = Depends(verifier),
):
    async with httpx.AsyncClient() as client:
        uuids = await _get_recommended_uuids(client, session, panel_id)
        if not uuids:
            return []

        return await _get_recommended_items(client, uuids)
