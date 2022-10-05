# pylint: disable=missing-function-docstring

""" Presentable items UI endpoint """
import datetime
import random
import uuid
from typing import Literal

import httpx
from fastapi import APIRouter, Depends
from httpx import AsyncClient

from app.config import RECOMMENDER_ENDPOINT, SOLR_URL
from app.generic.models.bad_request import BadRequest
from app.schemas.session_data import SessionData
from app.utils.cookie_validators import cookie, verifier

router = APIRouter()


def _get_panel(panel_id: str) -> list[str]:
    if panel_id == "publication":
        return ["publications"]
    elif panel_id == "datasets":
        return ["datasets"]
    elif panel_id == "software":
        return ["software"]
    elif panel_id == "training":
        return ["trainings"]
    elif panel_id == "service":
        # IMPORTANT!!! recommender does not support services
        return []


async def _get_recommendations(client: AsyncClient, session: SessionData, panel_id: str):
    panel_id_options = ["publication", "datasets", "software", "training"]
    page_id = "/search/" + panel_id
    panels = [random.choice(panel_id_options)] if panel_id == "all" else _get_panel(panel_id)
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

    return recommendation_data


async def _get_recommended_items(client: AsyncClient, uuids: list[str]):
    id_fq = " OR ".join([f'"{uuid}"' for uuid in uuids])
    respone = await client.post(
        f"{SOLR_URL}all_collection/select",
        json={
            "params": {
                "defType": "edismax",
                "q": "*",
                "qf": ["title", "description"],
                "fq": [f"id:({id_fq})"],
                "rows": 3,
                "wt": "json",
            }
        },
    )

    return respone.json()["response"]["docs"] if respone.status_code == 200 else []


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
        recommendation_data = _get_recommendations(client, session, panel_id)
        if not recommendation_data:
            return []

        uuids = recommendation_data[0]["recommendations"]
        return _get_recommended_items(client, uuids)
