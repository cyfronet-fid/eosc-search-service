#  pylint: disable=too-many-locals, too-many-arguments

"""Operations on Solr"""
from typing import Dict, Optional

from httpx import AsyncClient, Response

from app.consts import (
    CATALOGUE_QF,
    DEFAULT_QF,
    ORGANISATION_QF,
    PROJECT_QF,
    PROVIDER_QF,
)
from app.schemas.search_request import StatFacet, TermsFacet
from app.schemas.solr_response import Collection, SolrResponse
from app.settings import settings

from .error_handling import (
    SolrCollectionEmptyError,
    handle_solr_detail_response_errors,
    handle_solr_list_response_errors,
)
from .utils import (
    parse_organisation_filters,
    parse_project_filters,
    parse_providers_filters,
)


async def search(
    client: AsyncClient,
    collection: Collection,
    *,
    q: str,
    qf: str,
    fq: list[str],
    sort: list[str],
    rows: int,
    exact: str,
    cursor: str = "*",
    facets: dict[str, TermsFacet | StatFacet] = None,
    scope: Optional[str] = None,
) -> SolrResponse:
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
    q = q.replace("(", r"").replace(")", r"")
    q = q.replace("[", r"").replace("]", r"")
    q = q.replace("=", r"")
    q = q.replace(":", r"")
    if collection == Collection.ALL_COLLECTION and fq and "providers" in fq[0]:
        fq = parse_providers_filters(fq)
    mm_param = "80%"
    qs_param = "5"
    if exact == "true":
        mm_param = "100%"
        qs_param = "0"
    solr_collection = _get_solr_collection(collection, scope)
    if collection == Collection.PROJECT and fq:
        fq = parse_project_filters(fq)
    elif collection == Collection.ORGANISATION and fq:
        fq = parse_organisation_filters(fq)
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
            "mm": mm_param,
            # How much lower weights fields score is taken against high weights fields score
            # 0.0 === lower weight field score is treated as high weight field score
            # 1.0 === only highest weighted fields score will be taken
            # https://solr.apache.org/guide/6_6/the-dismax-query-parser.html#TheDisMaxQueryParser-Thetie_TieBreaker_Parameter
            "tie": "0.1",
            # Query phrase slop, define how far words can be in sentence
            # https://solr.apache.org/guide/6_6/the-dismax-query-parser.html#TheDisMaxQueryParser-Theqs_QueryPhraseSlop_Parameter
            "qs": qs_param,
            # Highlight, default: "false"
            # https://solr.apache.org/guide/solr/latest/query-guide/highlighting.html#highlighting-in-the-query-response
            "hl": "on",
            "hl.method": "fastVector",
            "hl.fragsize": 200,
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
        request_body["facet"] = {
            k: v.serialize_to_solr_format() for k, v in facets.items()
        }
        if "title" in request_body["facet"]:
            request_body["facet"] = None
    response = await handle_solr_list_response_errors(
        client.post(
            f"{settings.SOLR_URL}{solr_collection}/select",
            json=request_body,
        )
    )

    data = response.json()

    if len(data["response"]["docs"]) == 0:
        await _check_collection_sanity(client, collection, scope)

    return SolrResponse(collection=collection, data=data)


async def search_advanced(
    client: AsyncClient,
    collection: Collection,
    *,
    q: str,
    qf: str,
    fq: list[str],
    sort: list[str],
    rows: int,
    exact: str,
    cursor: str = "*",
    facets: dict[str, TermsFacet] | None,
    scope: Optional[str] = None,
) -> SolrResponse:
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
    q = q.replace("(", r"").replace(")", r"")
    q = q.replace("[", r"").replace("]", r"")
    q = q.replace("=", r"")
    q = q.replace(":", r"")

    mm_param = "80%"
    qs_param = "5"
    if exact == "true":
        mm_param = "100%"
        qs_param = "0"
    solr_collection = _get_solr_collection(collection, scope)
    if collection == Collection.PROJECT and fq:
        fq = parse_project_filters(fq)
    elif collection == Collection.ORGANISATION and fq:
        fq = parse_organisation_filters(fq)
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
            "mm": mm_param,
            # How much lower weights fields score is taken against high weights fields score
            # 0.0 === lower weight field score is treated as high weight field score
            # 1.0 === only highest weighted fields score will be taken
            # https://solr.apache.org/guide/6_6/the-dismax-query-parser.html#TheDisMaxQueryParser-Thetie_TieBreaker_Parameter
            "tie": "0.1",
            # Query phrase slop, define how far words can be in sentence
            # https://solr.apache.org/guide/6_6/the-dismax-query-parser.html#TheDisMaxQueryParser-Theqs_QueryPhraseSlop_Parameter
            "qs": qs_param,
            # Highlight, default: "false"
            # https://solr.apache.org/guide/solr/latest/query-guide/highlighting.html#highlighting-in-the-query-response
            "hl": "on",
            "hl.method": "fastVector",
            "hl.fragsize": 200,
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
        if "title" in request_body["facet"]:
            request_body["facet"] = None

    response = await handle_solr_list_response_errors(
        client.post(
            f"{settings.SOLR_URL}{solr_collection}/select",
            json=request_body,
        )
    )
    data = response.json()

    if facets and len(data["response"]["docs"]) == 0:
        await _check_collection_sanity(client, collection, scope)

    return SolrResponse(collection=collection, data=data)


async def _check_collection_sanity(client, collection, scope: Optional[str] = None):
    """
    Helper function checking if the solr collection is not empty in case of solr data request
    returns a response with no data.
    """
    if collection == Collection.PROVIDER:
        qf = PROVIDER_QF
    elif collection == Collection.ORGANISATION:
        qf = ORGANISATION_QF
    elif collection == Collection.PROJECT:
        qf = PROJECT_QF
    elif collection == Collection.CATALOGUE:
        qf = CATALOGUE_QF

    else:
        qf = DEFAULT_QF
    request_body = {
        "params": {
            "defType": "edismax",
            "lowercaseOperators": "false",
            "mm": "80%",
            "tie": "0.1",
            "qs": "5",
            "hl": "on",
            "hl.method": "fastVector",
            "q": "*",
            "qf": qf,
            "pf": qf,
            "fq": [],
            "rows": 1,
            "cursorMark": "*",
            "sort": "score desc, id asc",
            "wt": "json",
        }
    }
    solr_collection = _get_solr_collection(collection, scope)
    response = await handle_solr_list_response_errors(
        client.post(
            f"{settings.SOLR_URL}{solr_collection}/select",
            json=request_body,
        )
    )
    if len(response.json()["response"]["docs"]) == 0:
        raise SolrCollectionEmptyError()


async def get(
    client: AsyncClient,
    collection: Collection,
    item_id: int | str,
    scope: Optional[str] = None,
) -> Dict:
    """Get item from defined collection based on ID"""
    solr_collection = _get_solr_collection(collection, scope)
    url = f"{settings.SOLR_URL}{solr_collection}/get?id={item_id}"
    response = await handle_solr_detail_response_errors(client.get(url))
    response = response.json()

    return response


async def get_item_by_pid(
    client: AsyncClient,
    collection: Collection,
    item_pid: str,
    scope: Optional[str] = None,
) -> Response:
    """Get item from defined collection based on PID"""
    solr_collection = _get_solr_collection(collection, scope)
    url = f"{settings.SOLR_URL}{solr_collection}/query?q=pid:{item_pid}"
    return await handle_solr_list_response_errors(client.get(url))


def search_dep():
    """FastAPI search method dependency"""
    return search


def search_advanced_dep():
    """FastAPI search method dependency"""
    return search_advanced


def get_dep():
    """get method dependency"""
    return get


def _get_solr_collection(collection: Collection, scope: Optional[str] = None):
    prefix_mapping = {"pl": "pl_", "eu": "", "": ""}
    actual_prefix = prefix_mapping.get(scope, settings.COLLECTIONS_PREFIX)
    return f"{actual_prefix}{collection}"
