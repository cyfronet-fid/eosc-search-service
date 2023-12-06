import random
import re

from fastapi import HTTPException
from starlette.requests import Request

from app.consts import COLLECTION_TO_PANEL_ID_MAP, PANEL_ID_OPTIONS, Collection, PanelId
from app.utils.cookie_validators import backend, cookie


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


def _get_panel(collection: Collection, sort_by_relevance: bool = False) -> PanelId:
    if not sort_by_relevance and collection == Collection.ALL_COLLECTION:
        return random.choice(PANEL_ID_OPTIONS).value
    return COLLECTION_TO_PANEL_ID_MAP[collection].value


async def get_session(request: Request):
    """Get session and session_id"""
    session_id = None
    try:
        session_id = cookie(request)
        session = await backend.read(session_id)
    except HTTPException:
        session = None
    return session, session_id
