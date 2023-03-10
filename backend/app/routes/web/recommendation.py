# pylint: disable=missing-function-docstring

""" Presentable items UI endpoint """
import logging

import httpx
from fastapi import APIRouter, HTTPException, Query, Request
from httpx import ReadTimeout

from app.config import SHOW_RECOMMENDATIONS
from app.generic.models.bad_request import BadRequest
from app.routes.web.recommendation_utils.common import (
    RecommendationPanelId,
    RecommenderError,
    SolrRetrieveError,
    get_session,
)
from app.routes.web.recommendation_utils.recommendations import (
    get_fixed_recommendations,
    get_recommended_items,
    get_recommended_uuids,
)
from app.routes.web.recommendation_utils.sort_by_relevance import (
    get_candidates,
    perform_sort_by_relevance,
    sort_docs,
)

router = APIRouter()

logger = logging.getLogger(__name__)


@router.get(
    "/recommendations",
    responses={200: {"model": dict}, 500: {"model": BadRequest}},
)
async def get_recommendations(panel_id: RecommendationPanelId, request: Request):
    if SHOW_RECOMMENDATIONS is False:
        return []
    session, session_id = await get_session(request)

    try:
        async with httpx.AsyncClient() as client:
            try:
                uuids = await get_recommended_uuids(client, session, panel_id)
                items = await get_recommended_items(client, uuids)
                return {"recommendations": items, "isRand": False}
            except (RecommenderError, SolrRetrieveError, ReadTimeout) as error:
                uuids = await get_fixed_recommendations(session_id, panel_id)
                items = await get_recommended_items(client, uuids)
                return {
                    "recommendations": items,
                    "isRand": True,
                    "message": (
                        str(error)
                        or "Solr or external recommender service read timeout"
                    ),
                }
    except (RecommenderError, SolrRetrieveError) as e:
        logger.error("%s. %s", str(e), e.data)
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get(
    "/sort_by_relevance",
    responses={200: {"model": dict}, 500: {"model": BadRequest}},
)
async def sort_by_relevance(
    panel_id: RecommendationPanelId,
    request: Request,
    q: str = Query("*", description="Free-form query string"),
    qf: str = Query("id", description="Query fields"),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
):
    if SHOW_RECOMMENDATIONS is False:
        return []
    session, _ = await get_session(request)

    try:
        async with httpx.AsyncClient() as client:
            try:
                candidates_ids, docs = await get_candidates(panel_id, q, qf, fq)
                uuids = await perform_sort_by_relevance(
                    client, session, panel_id, candidates_ids
                )
                items = await sort_docs(uuids, docs)
                return {"recommendations": items, "isRand": False}
            except (
                RecommenderError,
                SolrRetrieveError,
                ReadTimeout,
                ValueError,
            ) as error:
                return {
                    "recommendations": [],
                    "message": (
                        str(error)
                        or "Solr or external recommender service read timeout"
                    ),
                }
    except (RecommenderError, SolrRetrieveError) as e:
        logger.error("%s. %s", str(e), e.data)
        raise HTTPException(status_code=500, detail=str(e)) from e
