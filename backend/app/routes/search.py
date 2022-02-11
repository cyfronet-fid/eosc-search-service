"""The Search endpoint"""

from json import JSONDecodeError

from fastapi import Body, HTTPException, Query
from httpx import AsyncClient

from app.schemas.search_request import SearchRequest
from app.solr.operations import search

from .util import DEFAULT_SORT, internal_api_router


# pylint: disable=too-many-arguments
@internal_api_router.post("/search", name="apis:post-search")
async def search_post(
    collection: str = Query(..., description="Collection"),
    q: str = Query(..., description="Free-form query string"),
    qf: list[str] = Query([], description="Query fields", example=["authors", "title"]),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
    sort: list[str] = Query(
        [], description="Sort order", example=["description asc", "name desc"]
    ),
    rows: int = Query(10, description="Row count", gte=0, le=100),
    cursor: str = Query("*", description="Cursor"),
    request: SearchRequest = Body(..., description="Request body"),
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
            cursor=cursor,
            facets=request.facets,
        )
    if response.is_error:
        try:
            detail = response.json()["error"]["msg"]
        except (KeyError, JSONDecodeError):
            detail = None
        raise HTTPException(status_code=response.status_code, detail=detail)
    res_json = response.json()
    out = {
        "results": res_json["response"]["docs"],
        "nextCursorMark": res_json["nextCursorMark"],
    }
    try:
        out["facets"] = res_json["facets"]
    except KeyError:
        pass
    return out
