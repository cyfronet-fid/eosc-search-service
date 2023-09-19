# pylint: disable=missing-function-docstring

""" Presentable items UI endpoint """
import logging

import httpx
from fastapi import APIRouter, HTTPException, Request
from httpx import ReadTimeout

from app.consts import Collection
from app.generic.models.bad_request import BadRequest
from app.recommender.router_utils.common import (
    RecommenderError,
    SolrRetrieveError,
    get_session,
)
from app.recommender.router_utils.recommendations import (
    get_fixed_recommendations,
    get_recommended_items,
    get_recommended_uuids,
)
from app.recommender.router_utils.sort_by_relevance import (
    parse_candidates,
    perform_sort_by_relevance,
    sort_docs,
)
from app.settings import settings

router = APIRouter()

logger = logging.getLogger(__name__)


@router.get(
    "/recommendations",
    responses={200: {"model": dict}, 500: {"model": BadRequest}},
)
async def get_recommendations(panel_id: Collection, request: Request):
    if settings.SHOW_RECOMMENDATIONS is False:
        return []
    session, _ = await get_session(request)

    try:
        async with httpx.AsyncClient() as client:
            try:
                uuids = await get_recommended_uuids(client, session, panel_id)
                items = await get_recommended_items(client, uuids)
                return {"recommendations": items, "isRand": False}
            except (RecommenderError, SolrRetrieveError, ReadTimeout) as error:
                uuids = await get_fixed_recommendations(panel_id)
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


async def sort_by_relevance(
    request: Request,
    panel_id: Collection,
    documents: list,
):
    session, _ = await get_session(request)

    try:
        async with httpx.AsyncClient() as client:
            try:
                candidates_ids = await parse_candidates(documents)
                uuids = await perform_sort_by_relevance(
                    client, session, panel_id, candidates_ids
                )
                items = await sort_docs(uuids, documents)
                return {"recommendations": items, "message": ""}
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
