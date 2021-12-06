"""The APIs"""

from fastapi import APIRouter, Query
from httpx import AsyncClient

from .config import SOLR_URL

internal_api_router = APIRouter()


@internal_api_router.get("/search")
async def search_get(
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


@internal_api_router.get("/recommend")
async def recommend_post(
    q: str = Query(..., description="Query string"),
    collection: str = Query(..., description="Collection"),
    rs_prefix: str = Query(
        ..., description="RS instance prefix", example="http://localhost:9080/"
    ),
):
    """Do a search against the specified collection, pass results to RS"""
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
        solr_response = await client.get(
            f"{SOLR_URL}{collection}/select",
            params={"q": " ".join(query), "wt": "json"},
        )
        solr_response.raise_for_status()

        payload = {
            "unique_id": "string",
            "timestamp": "2021-12-03T12:08:27.728Z",
            "visit_id": "string",
            "page_id": "string",
            "panel_id": ["string"],
            "num_lists": 1,
            "candidates": [
                doc_to_candidate(doc)
                for doc in solr_response.json()["response"]["docs"]
            ],
            "search_data": {
                "q": q,
                "collection": collection,
            },
        }

        rs_response = await client.post(f"{rs_prefix}recommendations", json=payload)

    rs_response.raise_for_status()

    return {
        "results": rs_response.json()[0]["recommendations"],
    }


def doc_to_candidate(doc):
    """Convert a document from Solr response to its pid or id"""
    try:
        return doc["pid"][0]
    except KeyError:
        return doc["id"]
