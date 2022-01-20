"""Operations on Solr"""
from httpx import AsyncClient, Response

from app.config import SOLR_URL


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
    """
    return await client.get(
        f"{SOLR_URL}{collection}/select",
        params={
            "defType": "edismax",
            "q": q,
            "qf": qf,
            "fq": fq,
            "rows": rows,
            "cursorMark": cursor,
            "sort": ", ".join(sort),
            "wt": "json",
        },
    )
