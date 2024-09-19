# pylint: disable=missing-function-docstring

"""Presentable items UI endpoint"""
import logging
import uuid
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException, Request
from httpx import ReadTimeout
from starlette.responses import JSONResponse

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
from app.solr.error_handling import SolrDocumentNotFoundError

router = APIRouter()

logger = logging.getLogger(__name__)


@router.get(
    "/recommendations",
    responses={200: {"model": dict}, 500: {"model": BadRequest}},
)
async def get_recommendations(
    panel_id: Collection,
    request: Request,
    scope: Optional[str] = None,
):
    if settings.SHOW_RECOMMENDATIONS is False:
        return []
    session, _ = await get_session(request)
    try:
        async with httpx.AsyncClient(timeout=None) as client:
            recommendation_visit_id = str(uuid.uuid4())

            try:
                uuids = await get_recommended_uuids(
                    client, session, panel_id, recommendation_visit_id
                )
                items = await get_recommended_items(client, uuids, scope)
                resp = JSONResponse({"recommendations": items, "isRand": False})
                # Let's store the recommendation visit id for retrieval in the user actions
                resp.set_cookie("recommendation_visit_id", recommendation_visit_id)
                return resp
            except (RecommenderError, ReadTimeout, SolrDocumentNotFoundError) as error:
                items = []
                if settings.SHOW_RANDOM_RECOMMENDATIONS:
                    uuids = await get_fixed_recommendations(panel_id, scope=scope)
                    items = await get_recommended_items(client, uuids, scope)

                resp = JSONResponse({
                    "recommendations": items,
                    "isRand": bool(items),
                    "message": (
                        str(error)
                        or "Solr or external recommender service read timeout"
                    ),
                })
                # We're storing the visit id for fixed recommendations just in case as well
                resp.set_cookie("recommendation_visit_id", recommendation_visit_id)
                return resp

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
        async with httpx.AsyncClient(timeout=None) as client:
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
