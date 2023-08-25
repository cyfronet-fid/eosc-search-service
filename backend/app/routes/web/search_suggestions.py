"""The UI Search endpoint"""
import asyncio
import logging
from json import JSONDecodeError
from typing import Dict, Tuple

from fastapi import APIRouter, Depends, HTTPException, Query
from httpx import AsyncClient, TransportError
from pydantic.typing import Literal
from requests import Response

from app.settings import settings
from app.solr.operations import search_dep

from ..utils import DEFAULT_SORT, parse_col_name

router = APIRouter()

logger = logging.getLogger(__name__)


SortUi = Literal["dmr", "dlr", "mp", "r", "default"]


# pylint: disable=too-many-arguments
@router.post("/search-suggestions", name="web:post-search-suggestions")
async def search_suggestions(
    collection: str = Query(..., description="Collection"),
    q: str = Query(..., description="Free-form query string"),
    qf: str = Query(..., description="Query fields"),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
    results_per_collection: int = Query(
        3, description="Row count per collection", gte=3, lt=10
    ),
    search=Depends(search_dep),
) -> Dict[str, list[Dict]]:
    """
    Main function performing the search for suggestions.
    Serves as the dispatch function for `all_collection` search request.
    The q, qf, fq, sort params correspond to
    https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html.
    """
    all_collection = (
        "publication",
        "dataset",
        "software",
        "service",
        "data_source",
        "training",
        "guideline",
        "bundle",
        "other_rp",
        "provider",
    )

    collections = all_collection if "all_collection" in collection else (collection,)
    gathered_result = await asyncio.gather(
        *[
            _search(col, q, qf, fq, results_per_collection, search)
            for col in collections
        ]
    )

    return dict(gathered_result)


async def _search(
    collection: str = Query(..., description="Collection"),
    q: str = Query(..., description="Free-form query string"),
    qf: str = Query(..., description="Query fields"),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
    results_per_collection: int = Query(
        3, description="Row count per collection", gte=3, lt=10
    ),
    search=Depends(search_dep),
) -> Tuple[str, Dict]:
    """Performs the search in a single collection"""
    if "provider" in collection:
        qf = "title^100 description^10 scientific_domains^10"
    if settings.NG_COLLECTIONS_PREFIX not in collection:
        collection = f"{settings.NG_COLLECTIONS_PREFIX}{collection}"
    async with AsyncClient() as client:
        response = await handle_search_errors(
            search(
                client,
                collection,
                q=q,
                qf=qf,
                fq=fq,
                sort=DEFAULT_SORT,
                rows=results_per_collection,
            )
        )

        res_json = response.json()
    collection = await parse_col_name(collection)
    return collection, res_json["response"]["docs"]


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
