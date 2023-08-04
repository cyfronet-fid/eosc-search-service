"""The UI Search endpoint"""
import asyncio
import logging
from json import JSONDecodeError

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from httpx import AsyncClient, TransportError
from pydantic.typing import Literal
from requests import Response

from app.schemas.search_request import SearchRequest, StatFacet, TermsFacet
from app.solr.operations import search_dep

from ..util import DEFAULT_SORT

router = APIRouter()

logger = logging.getLogger(__name__)

SortUi = Literal["dmr", "dlr", "mp", "r", "default"]


# pylint: disable=too-many-arguments
@router.post("/search-filters", name="web:post-search-filters")
async def search_filters(
    collection: str = Query(..., description="Collection"),
    q: str = Query(..., description="Free-form query string"),
    qf: str = Query(..., description="Query fields"),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
    rows: int = Query(10, description="Row count", gte=3, le=100),
    cursor: str = Query("*", description="Cursor"),
    request: SearchRequest = Body(..., description="Request body"),
    search=Depends(search_dep),
):
    """
    Do a search for filters for specified (multiple) facets.

    The q, qf, fq, sort params correspond to
    https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html.
    Paging is cursor-based, see
    https://solr.apache.org/guide/8_11/pagination-of-results.html#fetching-a-large-number-of-sorted-results-cursors.
    """
    results = {}

    coroutines = [
        _search(collection, q, qf, fq, rows, cursor, {key: value}, search)
        for key, value in request.facets.items()
    ]

    gathered = await asyncio.gather(*coroutines)

    for key, result in zip(request.facets.keys(), gathered):
        results.update(result)

    return results


async def _search(
    collection: str = Query(..., description="Collection"),
    q: str = Query(..., description="Free-form query string"),
    qf: str = Query(..., description="Query fields"),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
    rows: int = Query(10, description="Row count", gte=3, le=100),
    cursor: str = Query("*", description="Cursor"),
    facet: dict[TermsFacet | StatFacet] = TermsFacet,
    search=Depends(search_dep),
) -> dict:
    async with AsyncClient() as client:
        response = await handle_search_errors(
            search(
                client,
                collection,
                q=q,
                qf=qf,
                fq=fq,
                sort=DEFAULT_SORT,
                rows=rows,
                cursor=cursor,
                facets=facet,
            )
        )

        res_json = response.json()

    return await create_output(res_json)


async def create_output(res_json: dict) -> dict:
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


async def handle_search_errors(search_coroutine) -> Response:
    """Wrap search errors for HTTP endpoint purposes"""

    try:
        response = await search_coroutine
    except TransportError as e:
        raise HTTPException(status_code=500, detail="Try again later") from e
    if response.is_error:
        try:
            detail = response.json()["error"]["msg"]
        except (KeyError, JSONDecodeError):
            detail = None
        raise HTTPException(status_code=response.status_code, detail=detail)
    return response
