"""Endpoint for adding a research product to favourites"""
import asyncio
import logging
from contextlib import suppress
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from httpx import AsyncClient, HTTPError
from pydantic import AnyUrl

from app.consts import ResearchProductCollection
from app.schemas.research_product_response import ResearchProductResponse
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
        response = response.json()["doc"]

    if response is None:
        raise HTTPException(status_code=404, detail="Research product not found")

    return ResearchProductResponse(
        title=" ".join(response["title"]),
        links=await _validate_urls(response["url"]),
        author=response["author_names"],
        type=response["type"],
    )


async def _validate_urls(urls: List[AnyUrl]) -> List[Optional[AnyUrl]]:
    """Runs a validation for every url for the product and returns
    only the valid ones.
    """
    valid_urls = await asyncio.gather(*[_validate_url(url) for url in urls])
    return list(filter(None, valid_urls))


async def _validate_url(url: AnyUrl) -> Optional[AnyUrl]:
    """Performs a request to check a link's validity"""
    response = None
    async with AsyncClient() as async_client:
        with suppress(HTTPError):
            response = await async_client.get(url, follow_redirects=True)
    if not response or response.is_client_error:
        return None
    return url
