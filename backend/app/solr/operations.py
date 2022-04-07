"""Operations on Solr"""
from httpx import AsyncClient, Response

from app.schemas.search_request import TermsFacet


async def search(
    client: AsyncClient,
    collection: str,
    *,
    q: str,
    qf: list[str],
    fq: list[str],
    sort: list[str],
    rows: int,
    cursor: str = "*",
    facets: dict[str, TermsFacet] = None,
) -> Response:
    # pylint: disable=line-too-long
    """
    Retrieve search results for a specified collection.

    Expect an AsyncClient to execute the request against. This allows the calling party to control the lifecycle
    of the client.

    The q, qf, fq, sort params correspond to
    https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html.
    Paging is cursor-based, see
    https://solr.apache.org/guide/8_11/pagination-of-results.html#fetching-a-large-number-of-sorted-results-cursors.

    Facets support a subset of parameters from: https://solr.apache.org/guide/8_11/json-facet-api.html.
    """
    request_body = {
        "params": {
            "defType": "edismax",
            "q": q,
            "qf": qf,
            "fq": fq,
            "rows": rows,
            "cursorMark": cursor,
            "sort": ", ".join(sort),
            "wt": "json",
        }
    }
    if facets is not None and len(facets) > 0:
        request_body["facet"] = {k: v.dict() for k, v in facets.items()}
    # pylint: disable=import-outside-toplevel
    from app.config import SOLR_URL

    return await client.post(
        f"{SOLR_URL}{collection}/select",
        json=request_body,
    )


def search_dep():
    """FastAPI search method dependency"""
    return search
