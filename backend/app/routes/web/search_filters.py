"""The UI Search endpoint"""

import asyncio
import logging
from typing import Callable, Optional

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from httpx import AsyncClient
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

from app.consts import DEFAULT_SORT, Collection
from app.schemas.search_request import SearchRequest, StatFacet, TermsFacet
from app.solr.operations import search_dep
from app.utils.http_client import make_async_http_client

router = APIRouter()

logger = logging.getLogger(__name__)


# pylint: disable=too-many-arguments,too-many-locals
@router.post("/search-filters", name="web:post-search-filters")
async def search_filters(
    collection: Collection = Query(..., description="Collection"),
    q: str = Query(..., description="Free-form query string"),
    qf: str = Query(..., description="Query fields"),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
    rows: int = Query(10, description="Row count", gte=3, le=100),
    cursor: str = Query("*", description="Cursor"),
    exact: str = Query(..., description="Exact match"),
    request: SearchRequest = Body(..., description="Request body"),
    search=Depends(search_dep),
    scope: Optional[str] = None,
):
    """
    Do a search for filters for specified (multiple) facets.

    The q, qf, fq, sort params correspond to
    https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html.
    Paging is cursor-based, see
    https://solr.apache.org/guide/8_11/pagination-of-results.html#fetching-a-large-number-of-sorted-results-cursors.
    """
    results = {}
    if request.facets is None:
        raise HTTPException(status_code=500)
    if collection == Collection.PROJECT:
        request.facets = parse_project_facets(request.facets)

    if collection == Collection.ORGANISATION:
        request.facets = parse_organisation_facets(request.facets)

    client = make_async_http_client()
    coroutines = [
        _search(
            collection,
            q,
            qf,
            fq,
            rows,
            cursor,
            key,
            value,
            exact,
            search,
            client,
            scope,
        )
        for key, value in request.facets.items()
    ]

    try:
        gathered = await asyncio.gather(*coroutines)
    except Exception as e:
        logger.exception("Filters errored")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve filters from DB",
        ) from e

    for key, result in zip(request.facets.keys(), gathered):
        results.update(result)

    return results


async def _search(
    collection: Collection,
    q: str,
    qf: str,
    fq: list[str],
    rows: int,
    cursor: str,
    facet_key: str,
    facet_value: TermsFacet | StatFacet,
    exact: str,
    search: Callable,
    client: AsyncClient,
    scope: Optional[str] = None,
) -> dict:
    response = await search(
        client,
        collection,
        q=q,
        qf=qf,
        # filter out fq within the same facet to create "OR" type logic
        fq=list(filter(lambda term: not term.startswith(facet_key + ":"), fq)),
        sort=DEFAULT_SORT,
        rows=rows,
        cursor=cursor,
        facets={facet_key: facet_value},
        exact=exact,
        scope=scope,
    )

    return create_output(response.data)


def create_output(res_json: dict) -> dict:
    """Create an output"""
    facets_json = res_json.get("facets", {})
    del facets_json["count"]

    out = {}
    for filter_name, buckets in facets_json.items():
        if "buckets" in buckets:
            out[filter_name] = [
                {"val": bucket["val"], "count": bucket["count"]}
                for bucket in buckets["buckets"]
            ]
    return out


def parse_project_facets(facets):
    """
    Function removing 'status' facet.
    """
    facets.pop("project_status", None)
    return facets


def parse_organisation_facets(facets):
    """
    Function removing 'status' facet.
    """
    facets.pop("related_resources", None)
    return facets
