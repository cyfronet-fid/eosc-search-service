import random
import re
from typing import Literal

from fastapi import HTTPException
from starlette.requests import Request

from app.utils.cookie_validators import backend, cookie

RecommendationPanelId = Literal[
    "all",
    "publication",
    "dataset",
    "software",
    "other",
    "training",
    "service",
    "data-source",
    "bundle",
    "guideline",
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


def _get_panel(panel_id: RecommendationPanelId, sort_by_relevance: bool = False) -> str:
    panel_id_options = [
        "publications",
        "datasets",
        "software",
        "trainings",
        "other_research_product",
        "services",
    ]

    if not sort_by_relevance and panel_id == "all":
        return random.choice(panel_id_options)

    match panel_id:
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
        case "bundle":
            return "bundles"
        case "guideline":
            return "guidelines"

        case _:
            return panel_id


async def get_session(request: Request):
    """Get session and session_id"""
    session_id = None
    try:
        session_id = cookie(request)
        session = await backend.read(session_id)
    except HTTPException:
        session = None
    return session, session_id
