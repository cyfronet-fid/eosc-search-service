"""Endpoint for catalogue filters"""
import logging
from typing import Callable

from fastapi import APIRouter, Depends
from httpx import AsyncClient

from app.consts import (
    DEFAULT_CATALOGUE_NAME,
    DEFAULT_QF,
    DEFAULT_SORT,
    RESEARCH_PRODUCT_TYPES_LIST,
    Collection,
    FilterField,
)
from app.schemas.facets_response import FacetResponse
from app.schemas.search_request import SearchRequest, TermsFacet
from app.solr.operations import search_dep

router = APIRouter()

logger = logging.getLogger(__name__)


@router.post("/filters_all_collection/{field}")
async def get_filters_values(
    field: FilterField, search=Depends(search_dep)
) -> list[FacetResponse]:
    """Endpoint providing list of all available catalogue names with entities count"""
    request = SearchRequest(facets=_get_facets_object(field=field))

    async with AsyncClient(timeout=None) as client:
        response = await search(
            client,
            collection=Collection.ALL_COLLECTION,
            q="*",
            qf=DEFAULT_QF,
            fq=[],
            sort=DEFAULT_SORT,
            rows=0,
            exact=False,
            cursor="*",
            facets=request.facets,
        )
    data = response.data["facets"][field]["buckets"]
    return await _parse_catalog_response(data=data, field=field, search=search)


@router.post("/filters/{collection}/{field}")
async def get_filters_per_collection(
    collection: Collection, field: FilterField, search=Depends(search_dep)
) -> list[FacetResponse]:
    """
    Endpoint providing catalogue names available for a given collection with the entities count
    """
    request = SearchRequest(facets=_get_facets_object(field=field))

    async with AsyncClient(timeout=None) as client:
        response = await search(
            client,
            collection=collection,
            q="*",
            qf=DEFAULT_QF,
            fq=[],
            sort=DEFAULT_SORT,
            rows=0,
            exact=False,
            cursor="*",
            facets=request.facets,
        )
    data = response.data["facets"][field]["buckets"]
    return [FacetResponse(name=item["val"], count=item["count"]) for item in data]


async def _parse_catalog_response(
    data: list[dict], field: FilterField, search: Callable
) -> list[FacetResponse]:
    """Helper function parsing non-rp facets response and adding all rp
    to the default catalogue for 'catalogue' filter
    """
    cat_dict = {item["val"]: item["count"] for item in data}
    if field == "catalogue":
        rp_count = await _get_rp_count(search=search)
        cat_dict[DEFAULT_CATALOGUE_NAME] += rp_count
    return [FacetResponse(name=item, count=cat_dict[item]) for item in cat_dict]


async def _get_rp_count(search: Callable) -> int:
    """Helper function getting the number of entities in rp collections"""
    request = SearchRequest(facets=_get_facets_object(FilterField.TYPE))
    async with AsyncClient(timeout=None) as client:
        response = await search(
            client,
            collection=Collection.ALL_COLLECTION,
            q="*",
            qf=DEFAULT_QF,
            fq=[],
            sort=DEFAULT_SORT,
            rows=0,
            exact=False,
            cursor="*",
            facets=request.facets,
        )
    data = response.data["facets"][FilterField.TYPE]["buckets"]
    return sum(
        item["count"] for item in data if item["val"] in RESEARCH_PRODUCT_TYPES_LIST
    )


def _get_facets_object(field: FilterField) -> dict[str, dict]:
    """Helper function responsible for providing facets with a given field"""
    facets = TermsFacet(
        field=field,
        offset=None,
        limit=-1,
        sort=None,
        mincount=None,
        missing=None,
        prefix=None,
        contains=None,
        containsIgnoreCase=None,
    )
    return {field: facets.serialize_to_solr_format()}
