"""The Search endpoint"""

from typing import Optional

from fastapi import Body, Depends, Query
from httpx import AsyncClient

from app.consts import DEFAULT_SORT
from app.schemas.search_request import SearchRequest
from app.solr.operations import search_dep

from .router import internal_api_router


# pylint: disable=too-many-arguments
@internal_api_router.post("/search", name="apis:post-search")
async def search_post(
    collection: str = Query(..., description="Collection"),
    q: str = Query(..., description="Free-form query string"),
    qf: str = Query(..., description="Query fields"),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
    exact: str = Query(..., description="Exact match"),
    sort: list[str] = Query(
        [], description="Sort order", example=["description asc", "name desc"]
    ),
    rows: int = Query(10, description="Row count", gte=3, le=100),
    cursor: str = Query("*", description="Cursor"),
    request: SearchRequest = Body(..., description="Request body"),
    search=Depends(search_dep),
    scope: Optional[str] = None,
):
    """
    Do a search against the specified collection.

    The q, qf, fq, sort params correspond to
    https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html.
    Paging is cursor-based, see
    https://solr.apache.org/guide/8_11/pagination-of-results.html#fetching-a-large-number-of-sorted-results-cursors.

    Facets can be specified in the request body, they allow a subset of functionality from
    https://solr.apache.org/guide/8_11/json-facet-api.html.
    """
    async with AsyncClient() as client:
        response = await search(
            client,
            collection,
            q=q,
            qf=qf,
            fq=fq,
            sort=sort + DEFAULT_SORT,
            rows=rows,
            exact=exact,
            cursor=cursor,
            facets=request.facets,
            scope=scope,
        )
    res_json = response.data
    out = {
        "results": res_json["response"]["docs"],
        "nextCursorMark": res_json["nextCursorMark"],
    }
    try:
        out["facets"] = res_json["facets"]
    except KeyError:
        pass
    return out
