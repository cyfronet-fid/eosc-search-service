# pylint: disable=missing-function-docstring,too-many-return-statements

""" Presentable items UI endpoint """
import datetime
import logging
import random
import re
import uuid
from typing import Literal

import httpx
from async_lru import alru_cache
from fastapi import APIRouter, HTTPException, Request
from httpx import AsyncClient, ReadTimeout
from starlette.status import HTTP_200_OK

from app.config import RECOMMENDER_ENDPOINT, SHOW_RECOMMENDATIONS
from app.generic.models.bad_request import BadRequest
from app.schemas.session_data import SessionData
from app.solr.operations import get, search
from app.utils.cookie_validators import backend, cookie

router = APIRouter()

logger = logging.getLogger(__name__)

RecommendationPanelId = Literal[
    "all",
    "publication",
    "dataset",
    "software",
    "training",
    "service",
    "other",
    "data-source",
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


def _get_panel(panel_id: RecommendationPanelId) -> str:
    panel_id_options = [
        "publications",
        "datasets",
        "software",
        "trainings",
        "other_research_product",
        "services",
    ]

    match panel_id:
        case "all":
            return random.choice(panel_id_options)
        case "publication":
            return "publications"
        case "dataset":
            return "datasets"
        case "other":
            return "other_research_product"
        case "training":
            return "trainings"
        case "service":
            return "services"
        case "data-source":
            return "data-sources"

        case _:
            return panel_id


async def _get_recommended_uuids(
    client: AsyncClient, session: SessionData | None, panel_id: RecommendationPanelId
):
    try:
        request_body = {
            "unique_id": session.session_uuid if session else str(uuid.uuid4()),
            "timestamp": datetime.datetime.utcnow().isoformat()[:-3] + "Z",
            "visit_id": str(uuid.uuid4()),
            "page_id": "/search/" + panel_id,
            "panel_id": _get_panel(panel_id),
            "candidates": [],
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


@router.get(
    "/recommendations",
    responses={200: {"model": dict}, 500: {"model": BadRequest}},
)
async def get_recommendations(panel_id: RecommendationPanelId, request: Request):
    if SHOW_RECOMMENDATIONS is False:
        return []
    session_id = None
    try:
        session_id = cookie(request)
        session = await backend.read(session_id)
    except HTTPException:
        session = None

    try:
        async with httpx.AsyncClient() as client:
            try:
                uuids = await _get_recommended_uuids(client, session, panel_id)
                items = await _get_recommended_items(client, uuids)
                return {"recommendations": items, "isRand": False}
            except (RecommenderError, SolrRetrieveError, ReadTimeout) as error:
                uuids = await get_fixed_recommendations(session_id, panel_id)
                items = await _get_recommended_items(client, uuids)
                return {
                    "recommendations": items,
                    "isRand": True,
                    "message": str(error)
                    or "Solr or external recommender service read timeout",
                }
    except (RecommenderError, SolrRetrieveError) as e:
        logger.error("%s. %s", str(e), e.data)
        raise HTTPException(status_code=500, detail=str(e)) from e
