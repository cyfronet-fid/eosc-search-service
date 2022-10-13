# pylint: disable=missing-function-docstring

""" Presentable items UI endpoint """
import datetime
import logging
import random
import re
import uuid
from typing import Literal

import httpx
from fastapi import APIRouter, HTTPException, Request
from httpx import AsyncClient

from app.config import RECOMMENDER_ENDPOINT, SHOW_RECOMMENDATIONS
from app.generic.models.bad_request import BadRequest
from app.schemas.session_data import SessionData
from app.solr.operations import get
from app.utils.cookie_validators import backend, cookie

router = APIRouter()

logger = logging.getLogger(__name__)

RecommendationPanelId = Literal[
    "all", "publication", "dataset", "software", "training", "service"
]

RE_INT = re.compile("^[0-9]+$")


class RecommendationHttpError(Exception):
    """Error with external services used during recommendation serving"""

    def __init__(self, message: str, http_status: int | None = None, data: dict = ...):
        self.message = message
        self.http_status = http_status
        self.data = {} if data is ... else data

    def __repr__(self):
        return f"{self.message}" + (
            f" [{self.http_status}]" if self.http_status else ""
        )

    def __str__(self):
        return self.__repr__()


class RecommenderError(RecommendationHttpError):
    """Error with recommender"""

    def __repr__(self):
        return f"[Recommender] {super().__repr__()}"


class SolrRetrieveError(RecommendationHttpError):
    """Error with retrieving data from SOLR"""

    def __repr__(self):
        return f"[SOLR] {super().__repr__()}"

    def __str__(self):
        return self.__repr__()


def _get_panel(panel_id: RecommendationPanelId) -> list[str]:
    # IMPORTANT!!! recommender does not support services
    panel_id_options = ["publications", "datasets", "software", "trainings"]
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
        case "service":
            return []
    raise ValueError(f"{panel_id} is not valid {RecommendationPanelId}")


async def _get_recommended_uuids(
    client: AsyncClient, session: SessionData | None, panel_id: RecommendationPanelId
):
    try:
        page_id = "/search/" + panel_id
        panels = _get_panel(panel_id)

        if not panels:
            return []

        request_body = {
            "user_id": session.aai_id if session else None,
            "unique_id": session.session_uuid if session else str(uuid.uuid4()),
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
            raise RecommenderError(
                http_status=response.status_code,
                message="Status error",
                data=response.json(),
            )

        recommendation_data = response.json()
        if len(recommendation_data) != 1:
            raise RecommenderError(message="No recommendations provided")

        recommendation_uuids = []

        for _id in recommendation_data[0]["recommendations"]:
            # This hack is required for trainings and other
            # resources with integer ids
            if RE_INT.match(_id):
                _id = str(int(_id) + 1000000)
            recommendation_uuids.append(_id)

        return recommendation_uuids
    except httpx.ConnectError as e:
        raise RecommenderError(message="Connection error") from e


async def _get_recommended_items(client: AsyncClient, uuids: list[str]):
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


@router.get(
    "/recommendations",
    responses={200: {"model": dict}, 500: {"model": BadRequest}},
)
async def get_recommendations(panel_id: RecommendationPanelId, request: Request):
    if SHOW_RECOMMENDATIONS is False:
        return []
    try:
        session_id = cookie(request)
        session = await backend.read(session_id)
    except HTTPException:
        session = None
    try:
        async with httpx.AsyncClient() as client:
            uuids = await _get_recommended_uuids(client, session, panel_id)
            return await _get_recommended_items(client, uuids)
    except (RecommenderError, SolrRetrieveError) as e:
        logger.error("%s. %s", str(e), e.data)
        raise HTTPException(status_code=500, detail=str(e)) from e
