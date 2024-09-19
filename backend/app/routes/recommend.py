"""The Recommend endpoint"""

from json import JSONDecodeError
from typing import Optional

from fastapi import Body, Depends, HTTPException, Query
from httpx import AsyncClient, TransportError

from app.consts import DEFAULT_SORT
from app.recommender.operations import recommendations
from app.routes.router import internal_api_router
from app.settings import settings
from app.solr.operations import search_dep

from ..schemas.recommend_request import RecommendRequest


# pylint: disable=too-many-arguments
@internal_api_router.post("/recommend")
async def recommend_post(
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
    search=Depends(search_dep),
    scope: Optional[str] = None,
):
    """
    Do a search against the specified collection, pass results to RS.

    The q, qf, fq, sort params correspond to
    https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html.
    """
    async with AsyncClient() as client:
        solr_response = await search(
            client,
            collection,
            q=q,
            qf=qf,
            fq=fq,
            sort=sort + DEFAULT_SORT,
            rows=settings.RS_ROWS,
            cursor="*",
            scope=scope,
        )
        try:
            rs_response = await recommendations(
                client,
                collection,
                solr_response.data["response"]["docs"],
                context=request,
                q=q,
                qf=qf,
                fq=fq,
                sort=sort,
            )
        except TransportError as e:
            raise HTTPException(status_code=500, detail="Try again later") from e
    if rs_response.is_error:
        try:
            detail = rs_response.json()["detail"]
        except (KeyError, JSONDecodeError):
            detail = None
        raise HTTPException(status_code=rs_response.status_code, detail=detail)
    return {
        "results": rs_response.json()[0]["recommendations"],
    }
