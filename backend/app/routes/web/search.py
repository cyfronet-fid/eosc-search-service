"""The UI Search endpoint"""

from json import JSONDecodeError

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from httpx import AsyncClient, TransportError

from app.schemas.web import SearchRequest
from app.solr.operations import search_dep

from ..util import DEFAULT_SORT

router = APIRouter()


# pylint: disable=too-many-arguments
@router.post("/search-results", name="web:post-search")
async def search_post(
    collection: str = Query(..., description="Collection"),
    q: str = Query(..., description="Free-form query string"),
    qf: str = Query(..., description="Query fields"),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
    sort: list[str] = Query(
        [], description="Sort order", example=["description asc", "name desc"]
    ),
    rows: int = Query(10, description="Row count", gte=3, le=100),
    cursor: str = Query("*", description="Cursor"),
    request: SearchRequest = Body(..., description="Request body"),
    search=Depends(search_dep),
):
    """
    Do a search against the specified collection.

    The q, qf, fq, sort params correspond to
    https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html.
    Paging is cursor-based, see
    https://solr.apache.org/guide/8_11/pagination-of-results.html#fetching-a-large-number-of-sorted-results-cursors.
    """
    async with AsyncClient() as client:
        try:
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
        except Exception as e:
            raise HTTPException(status_code=500, detail="Try again later") from e
    if response.is_error:
        try:
            detail = response.json()["error"]["msg"]
        except (KeyError, JSONDecodeError):
            detail = None
        raise HTTPException(status_code=response.status_code, detail=detail)
    res_json = response.json()
    out = {
        "results": res_json["response"]["docs"],
        "numFound": res_json["response"]["numFound"],
        "nextCursorMark": res_json["nextCursorMark"],
    }

    if "facets" in res_json:
        out["facets"] = res_json["facets"]

    if "highlighting" in res_json:
        out["highlighting"] = res_json["highlighting"]

    return out
