import datetime
import logging
import uuid

import httpx
from httpx import AsyncClient

from app.recommender.router_utils.common import Collection, RecommenderError, _get_panel
from app.schemas.session_data import SessionData
from app.settings import settings

logger = logging.getLogger(__name__)


def _get_raw_candidates() -> dict:
    """Get raw candidates for sort by relevance.
    Note that data sources are not included because they are not supported"""
    return {
        "dataset": [],
        "publication": [],
        "software": [],
        "other": [],
        "training": [],
        "service": [],
    }


async def parse_candidates(documents: list) -> [dict, list[dict]]:
    """Parse documents before sorting by relevance"""
    candidates_ids = _get_raw_candidates()

    for doc in documents:
        # MP recommender requires IDs as integers
        _id = int(doc["id"]) if doc["type"] == "service" else doc["id"]
        try:
            candidates_ids[doc["type"]].append(_id)
        except KeyError:
            continue

    return candidates_ids


async def perform_sort_by_relevance(
    client: AsyncClient,
    session: SessionData | None,
    panel_id: Collection,
    candidates_ids: dict,
):
    try:
        request_body = {
            "unique_id": session.session_uuid if session else str(uuid.uuid4()),
            "timestamp": datetime.datetime.utcnow().isoformat()[:-3] + "Z",
            "visit_id": str(uuid.uuid4()),
            "client_id": "search_service",
            "page_id": "/search/" + panel_id,
            "panel_id": _get_panel(panel_id, sort_by_relevance=True),
            "engine_version": "content_visit_sort",
            "candidates": candidates_ids,
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

        if "recommendations" not in parsed_response:
            raise RecommenderError(message="No recommendations provided")

        if sum(len(v) for v in candidates_ids.values()) != len(
            parsed_response["recommendations"]
        ):
            logger.warning(f"Not all candidates were returned by 'sort by relevance'")

        return parsed_response["recommendations"]

    except httpx.ConnectError as e:
        raise RecommenderError(message="Connection error") from e


async def sort_docs(uuids: list[str], docs: list[dict]) -> list[dict]:
    """Sort documents based on returned uuids by sorting by relevance"""
    sorted_docs = [doc for uuid in uuids for doc in docs if uuid == doc["id"]]

    return sorted_docs
