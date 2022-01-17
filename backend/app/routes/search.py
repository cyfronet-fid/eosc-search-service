"""The Search endpoint"""

from json import JSONDecodeError

from fastapi import HTTPException, Query
from httpx import AsyncClient

from app.config import SOLR_URL

from .util import DEFAULT_SORT, internal_api_router


@internal_api_router.get("/search", name="apis:get-search")
async def search_get(
    q: str = Query(..., description="Query string"),
    collection: str = Query(..., description="Collection"),
    rows: int = Query(10, description="Row count", gte=0, le=100),
    cursor: str = Query("*", description="Cursor"),
    sort: list[str] = Query(
        [], description="Sort order", example=["description asc", "name desc"]
    ),
):
    """Do a search against the specified collection"""
    async with AsyncClient() as client:
        response = await client.get(
            f"{SOLR_URL}{collection}/select",
            params={
                "defType": "edismax",
                "q": q,
                "rows": rows,
                "cursorMark": cursor,
                "sort": ", ".join(sort + DEFAULT_SORT),
                "wt": "json",
            },
        )
    if response.is_error:
        try:
            detail = response.json()["error"]["msg"]
        except (KeyError, JSONDecodeError):
            detail = None
        raise HTTPException(status_code=response.status_code, detail=detail)
    res_json = response.json()
    return {
        "results": res_json["response"]["docs"],
        "nextCursorMark": res_json["nextCursorMark"],
    }
