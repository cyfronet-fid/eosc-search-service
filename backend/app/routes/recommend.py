"""The Recommend endpoint"""
from datetime import datetime
from json import JSONDecodeError

from fastapi import Body, HTTPException, Query
from httpx import AsyncClient
from pydantic import BaseModel

from app.config import RS_ROWS, RS_URL, SOLR_URL

from .util import DEFAULT_SORT, internal_api_router


class RecommendRequest(BaseModel):
    """POST /recommend request"""

    unique_id: str
    timestamp: datetime
    visit_id: str
    page_id: str
    panel_id: str


@internal_api_router.post("/recommend")
async def recommend_post(
    q: str = Query(..., description="Query string"),
    collection: str = Query(..., description="Collection"),
    sort: list[str] = Query(
        [], description="Sort order", example=["description asc", "name desc"]
    ),
    request: RecommendRequest = Body(
        ...,
        example={
            "unique_id": "string",
            "timestamp": "2021-12-03T12:08:27.728Z",
            "visit_id": "string",
            "page_id": "string",
            "panel_id": "string",
        },
    ),
):
    """Do a search against the specified collection, pass results to RS"""
    async with AsyncClient() as client:
        solr_response = await client.get(
            f"{SOLR_URL}{collection}/select",
            params={
                "defType": "edismax",
                "q": q,
                "rows": RS_ROWS,
                "sort": ", ".join(sort + DEFAULT_SORT),
                "wt": "json",
            },
        )
        if solr_response.is_error:
            try:
                detail = solr_response.json()["error"]["msg"]
            except (KeyError, JSONDecodeError):
                detail = None
            raise HTTPException(status_code=solr_response.status_code, detail=detail)
        payload = {
            "unique_id": request.unique_id,
            "timestamp": str(request.timestamp),
            "visit_id": request.visit_id,
            "page_id": request.page_id,
            "panel_id": [request.panel_id],
            "num_lists": 1,
            "candidates": [
                doc_to_candidate(doc)
                for doc in solr_response.json()["response"]["docs"]
            ],
            "search_data": {
                "q": q,
                "collection": collection,
                "sort": ", ".join(sort),
            },
        }
        rs_response = await client.post(f"{RS_URL}recommendations", json=payload)
    if rs_response.is_error:
        try:
            detail = rs_response.json()["detail"]
        except (KeyError, JSONDecodeError):
            detail = None
        raise HTTPException(status_code=rs_response.status_code, detail=detail)
    return {
        "results": rs_response.json()[0]["recommendations"],
    }


def doc_to_candidate(doc):
    """Convert a document from Solr response to its first pid or id"""
    try:
        return doc["pid"][0]
    except (KeyError, IndexError):
        return doc["id"]
