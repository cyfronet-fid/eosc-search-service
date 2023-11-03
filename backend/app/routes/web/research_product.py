"""Endpoint for adding a research product to favourites"""
import logging
from contextlib import suppress
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from httpx import AsyncClient
from pydantic import ValidationError

from app.consts import ResearchProductCollection
from app.schemas.research_product_response import ResearchProductResponse, RPUrlPath
from app.solr.operations import get_dep

router = APIRouter()

logger = logging.getLogger(__name__)


@router.get("/research-product/{resource_type}/{rp_id}")
async def get_rp_by_id(
    resource_type: ResearchProductCollection, rp_id: str, solr_get=Depends(get_dep)
) -> Optional[ResearchProductResponse]:
    """
    Main function responsible for getting details for a given Solr document.
    Args:
        resource_type (str): string literal - one of permitted collections
        rp_id (str: ID of a research product to be found
        solr_get (callable): solr.operations `get` function
    """
    async with AsyncClient() as async_client:
        response = await solr_get(async_client, resource_type, rp_id)
        response = response["doc"]
    if response is None:
        raise HTTPException(status_code=404, detail="Research product not found")
    urls = []
    response_urls = response["url"]
    response_urls.append("google.com")
    for url in response["url"]:
        with suppress(ValidationError):
            RPUrlPath(url=url)
            urls.append(url)

    return ResearchProductResponse(
        title=" ".join(response["title"]),
        links=urls,
        author=response["author_names"],
        type=response["type"],
    )
