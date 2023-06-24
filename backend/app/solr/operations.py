"""Operations on Solr"""
from httpx import AsyncClient, Response

from app.config import SOLR_URL
from app.schemas.search_request import TermsFacet


async def search(
    client: AsyncClient,
    collection: str,
    *,
    q: str,
    qf: str,
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
            # Split query on white space before search
            # https://solr.apache.org/guide/6_6/the-extended-dismax-query-parser.html#TheExtendedDisMaxQueryParser-ThesowParameter
            # "sow": "false",
            # `and`, and `or` operators in query should be used as SOLR commands?
            "lowercaseOperators": "false",
            # Minimum match, minimum clauses that should match
            # https://solr.apache.org/guide/6_6/the-dismax-query-parser.html#TheDisMaxQueryParser-Themm_MinimumShouldMatch_Parameter
            # !!! IMPORTANT !!! It's working only when `q.op` isn't set !!!
            # "mm": "3<80% 9<70% 15<60% 25<50% 50<30% 100<20%",
            # "mm.autoRelax": "true",
            # Query operation
            # when "OR" === at least 1 clause should be matched
            # when "AND" === all clauses should match
            # "q.op": "AND",
            "mm": "80%",
            # How much lower weights fields score is taken against high weights fields score
            # 0.0 === lower weight field score is treated as high weight field score
            # 1.0 === only highest weighted fields score will be taken
            # https://solr.apache.org/guide/6_6/the-dismax-query-parser.html#TheDisMaxQueryParser-Thetie_TieBreaker_Parameter
            "tie": "0.1",
            # Query phrase slop, define how far words can be in sentence
            # https://solr.apache.org/guide/6_6/the-dismax-query-parser.html#TheDisMaxQueryParser-Theqs_QueryPhraseSlop_Parameter
            "qs": "5",
            # Highlight, default: "false"
            # https://solr.apache.org/guide/solr/latest/query-guide/highlighting.html#highlighting-in-the-query-response
            "hl": "on",
            "hl.method": "fastVector",
            # Highlight fields list
            # "hl.fl": "title,author_names,description,keywords,tag_list",
            "q": q,
            "qf": qf,
            "pf": qf,
            "fq": fq,
            "rows": rows,
            "cursorMark": cursor,
            "sort": ", ".join(sort),
            "wt": "json",
        }
    }

    if facets is not None and len(facets) > 0:
        request_body["facet"] = {k: v.dict() for k, v in facets.items()}

    return await client.post(
        f"{SOLR_URL}{collection}/select",
        json=request_body,
    )


async def searchadv(
    client: AsyncClient,
    collection: str,
    *,
    q: str,
    qf: str,
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
            # Split query on white space before search
            # https://solr.apache.org/guide/6_6/the-extended-dismax-query-parser.html#TheExtendedDisMaxQueryParser-ThesowParameter
            # "sow": "false",
            # `and`, and `or` operators in query should be used as SOLR commands?
            "lowercaseOperators": "false",
            # Minimum match, minimum clauses that should match
            # https://solr.apache.org/guide/6_6/the-dismax-query-parser.html#TheDisMaxQueryParser-Themm_MinimumShouldMatch_Parameter
            # !!! IMPORTANT !!! It's working only when `q.op` isn't set !!!
            # "mm": "3<80% 9<70% 15<60% 25<50% 50<30% 100<20%",
            # "mm.autoRelax": "true",
            # Query operation
            # when "OR" === at least 1 clause should be matched
            # when "AND" === all clauses should match
            # "q.op": "AND",
            "mm": "80%",
            # How much lower weights fields score is taken against high weights fields score
            # 0.0 === lower weight field score is treated as high weight field score
            # 1.0 === only highest weighted fields score will be taken
            # https://solr.apache.org/guide/6_6/the-dismax-query-parser.html#TheDisMaxQueryParser-Thetie_TieBreaker_Parameter
            "tie": "0.1",
            # Query phrase slop, define how far words can be in sentence
            # https://solr.apache.org/guide/6_6/the-dismax-query-parser.html#TheDisMaxQueryParser-Theqs_QueryPhraseSlop_Parameter
            "qs": "5",
            # Highlight, default: "false"
            # https://solr.apache.org/guide/solr/latest/query-guide/highlighting.html#highlighting-in-the-query-response
            "hl": "on",
            "hl.method": "fastVector",
            # Highlight fields list
            # "hl.fl": "title,author_names,description,keywords,tag_list",
            "q": q,
            "qf": qf,
            "pf": qf,
            "fq": fq,
            "rows": rows,
            "cursorMark": cursor,
            "sort": ", ".join(sort),
            "wt": "json",
        }
    }

    if facets is not None and len(facets) > 0:
        request_body["facet"] = {k: v.dict() for k, v in facets.items()}

    return await client.post(
        f"{SOLR_URL}{collection}/select",
        json=request_body,
    )


async def get(
    client: AsyncClient,
    collection: str,
    item_id: int | str,
) -> Response:
    """Get item from defined collection based on ID"""
    return await client.get(
        f"{SOLR_URL}{collection}/get?id={item_id}",
    )


async def get_item_by_pid(
    client: AsyncClient,
    collection: str,
    item_pid: str,
) -> Response:
    """Get item from defined collection based on PID"""
    url = f"{SOLR_URL}{collection}/query?q=pid:{item_pid}"
    return await client.get(url)


def search_dep():
    """FastAPI search method dependency"""
    return search


def searchadv_dep():
    """FastAPI search method dependency"""
    return searchadv


def get_dep():
    """get method dependency"""
    return get
