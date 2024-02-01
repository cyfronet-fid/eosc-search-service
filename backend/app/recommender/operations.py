#  pylint: disable=too-many-arguments
"""Operations on Recommender Service"""

from urllib.parse import urljoin

from httpx import AsyncClient, Response

from app.schemas.recommend_request import RecommendRequest
from app.settings import settings


async def recommendations(
    client: AsyncClient,
    collection: str,
    candidates: list[hash],
    *,
    context: RecommendRequest,
    q: str,
    qf: list[str],
    fq: list[str],
    sort: list[str],
) -> Response:
    """
    Retrieve recommendations from RS based on candidates.

    The q, qf, fq, sort are passed to RS as search_data.
    See https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html subsections for their
    meaning, they may not be used directly by the RS though.
    """
    payload = {
        "unique_id": context.unique_id,
        "timestamp": str(context.timestamp),
        "visit_id": context.visit_id,
        "page_id": context.page_id,
        "panel_id": [context.panel_id],
        "num_lists": 1,
        "candidates": [doc_to_candidate(doc) for doc in candidates],
        "search_data": {
            "q": q,
            "sort": ", ".join(sort),
            "collection": collection,
            "qf": qf,
            "fq": fq,
        },
    }
    return await client.post(urljoin(settings.RS_URL, "/recommendations"), json=payload)


def doc_to_candidate(doc):
    """Convert a document from Solr response to its first pid or id"""
    try:
        return doc["pid"][0]
    except (KeyError, IndexError):
        return doc["id"]
