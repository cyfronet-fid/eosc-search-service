"""The APIs"""

from fastapi import APIRouter, Query
from httpx import AsyncClient

from .config import SOLR_URL

internal_api_router = APIRouter()


@internal_api_router.get("/search")
async def search_get(
    # pylint: disable=invalid-name
    q: str = Query(..., description="Query string"),
    collection: str = Query(..., description="Collection"),
):
    """Do a search against the specified collection"""
    query = [
        f'{prefix}:"{q}"'
        for prefix in [
            "id",
            "pid",
            "title",
            "authors",
            "description",
            "journal",
            "language",
            "subject",
            "fulltext",
        ]
    ]
    async with AsyncClient() as client:
        response = await client.get(
            f"{SOLR_URL}{collection}/select",
            params={"q": " ".join(query), "wt": "json"},
        )
    response.raise_for_status()
    return {
        "results": response.json()["response"]["docs"],
    }
