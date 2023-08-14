"""Endpoint: get related services to certain interoperability guideline"""
import logging

from fastapi import APIRouter, HTTPException
from httpx import ReadTimeout

from app.dependencies.related_services import (
    RelatedServicesError,
    get_related_services_pids,
    get_whole_related_services,
)
from app.generic.models.bad_request import BadRequest
from app.recommender.router_utils.common import SolrRetrieveError
from app.utils.http_client import make_async_http_client

router = APIRouter()

logger = logging.getLogger(__name__)


@router.get(
    "/related_services",
    responses={200: {"model": dict}, 500: {"model": BadRequest}},
)
async def get_related_services(guideline_id: str):
    """Get related services for interoperability guideline"""
    try:
        async with make_async_http_client() as client:
            try:
                pids = await get_related_services_pids(client, guideline_id)
                items = await get_whole_related_services(client, pids)
                return {"related_services": items}
            except (RelatedServicesError, SolrRetrieveError, ReadTimeout) as error:
                return {
                    "related_services": [],
                    "message": str(error) or "Solr or provider component read timeout",
                }
    except (RelatedServicesError, SolrRetrieveError) as e:
        logger.error("%s. %s", str(e), e.data)
        raise HTTPException(status_code=500, detail=str(e)) from e
