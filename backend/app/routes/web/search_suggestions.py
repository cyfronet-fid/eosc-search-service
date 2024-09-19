"""The UI Search endpoint"""

import asyncio
import logging
from typing import Dict, Optional, Tuple

from fastapi import APIRouter, Depends, Query
from httpx import AsyncClient

from app.consts import ALL_COLLECTION_LIST, DEFAULT_SORT, PROVIDER_QF
from app.schemas.solr_response import Collection
from app.solr.operations import search_dep

router = APIRouter()

logger = logging.getLogger(__name__)


# pylint: disable=too-many-arguments
@router.post("/search-suggestions", name="web:post-search-suggestions")
async def search_suggestions(
    collection: Collection = Query(..., description="Collection"),
    q: str = Query(..., description="Free-form query string"),
    qf: str = Query(..., description="Query fields"),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
    exact: str = Query(..., description="Exact match"),
    results_per_collection: int = Query(
        3, description="Row count per collection", gte=3, lt=10
    ),
    search=Depends(search_dep),
    scope: Optional[str] = None,
) -> Dict[str, list[Dict]]:
    """
    Main function performing the search for suggestions.
    Serves as the dispatch function for `all_collection` search request.
    The q, qf, fq, sort params correspond to
    https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html.
    """

    collections = (
        ALL_COLLECTION_LIST
        if collection == Collection.ALL_COLLECTION
        else [
            collection,
        ]
    )

    gathered_result = await asyncio.gather(*[
        _search(
            col,
            q,
            qf,
            exact,
            fq,
            results_per_collection,
            search,
            scope,
        )
        for col in collections
    ])

    return dict(gathered_result)


async def _search(
    collection: str = Query(..., description="Collection"),
    q: str = Query(..., description="Free-form query string"),
    qf: str = Query(..., description="Query fields"),
    exact: str = Query(..., description="Exact match"),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
    results_per_collection: int = Query(
        3, description="Row count per collection", gte=3, lt=10
    ),
    search=Depends(search_dep),
    scope: Optional[str] = None,
) -> Tuple[str, Dict]:
    """Performs the search in a single collection"""
    if "provider" in collection:
        qf = PROVIDER_QF
    async with AsyncClient() as client:
        response = await search(
            client,
            collection,
            q=q,
            qf=qf,
            fq=fq,
            sort=DEFAULT_SORT,
            rows=results_per_collection,
            exact=exact,
            scope=scope,
        )

    res_json = response.data
    collection = response.collection
    return collection, res_json["response"]["docs"]
