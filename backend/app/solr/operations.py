#  pylint: disable=too-many-locals, too-many-arguments

"""Operations on Solr"""

from typing import Dict

from httpx import AsyncClient, Response

from app.consts import (
    CATALOGUE_QF,
    DEFAULT_QF,
    ORGANISATION_QF,
    PROJECT_QF,
    PROVIDER_QF,
    Collection,
    ResourceType,
)
from app.schemas.related_resources import RelatedResourceField
from app.schemas.search_request import StatFacet, TermsFacet
from app.schemas.solr_response import SolrResponse
from app.settings import settings

from .error_handling import (
    SolrCollectionEmptyError,
    SolrCollectionNotFoundError,
    handle_solr_detail_response_errors,
    handle_solr_list_response_errors,
)
from .utils import (
    first_solr_value,
    parse_organisation_filters,
    parse_project_filters,
    parse_providers_filters,
)

RELATED_RESOURCE_COLLECTIONS: dict[RelatedResourceField, Collection] = {
    "related_services": Collection.SERVICE,
    "related_guidelines": Collection.GUIDELINE,
}

RELATED_RESOURCE_TYPES: dict[RelatedResourceField, ResourceType] = {
    "related_services": ResourceType.SERVICE,
    "related_guidelines": ResourceType.GUIDELINE,
}


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
) -> SolrResponse:
    """
    Retrieve search results for a specified collection.

    Expect an AsyncClient to execute the request against.
    This allows the calling party to control the lifecycle
    of the client.

    The q, qf, fq, sort params correspond to
    https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html.
    Paging is cursor-based, see
    https://solr.apache.org/guide/8_11/pagination-of-results.html#fetching-a-large-number-of-sorted-results-cursors.

    Facets support a subset of parameters from:
    https://solr.apache.org/guide/8_11/json-facet-api.html.
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
    solr_collection = f"{settings.COLLECTIONS_PREFIX}{collection}"
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
            # `and`, and `or` operators in query should be used
            # as SOLR commands?
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
            # How much lower weights fields score is taken
            # against high weights fields score
            # 0.0 === lower weight field score is treated
            # as high weight field score
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
            # "hl.fl": "title,author_names,description,keywords",
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
        await _check_collection_sanity(client, collection)

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
) -> SolrResponse:
    """
    Retrieve search results for a specified collection.

    Expect an AsyncClient to execute the request against.
    This allows the calling party to control the lifecycle
    of the client.

    The q, qf, fq, sort params correspond to
    https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html.
    Paging is cursor-based, see
    https://solr.apache.org/guide/8_11/pagination-of-results.html#fetching-a-large-number-of-sorted-results-cursors.

    Facets support a subset of parameters from:
    https://solr.apache.org/guide/8_11/json-facet-api.html.
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
    solr_collection = f"{settings.COLLECTIONS_PREFIX}{collection}"
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
            # `and`, and `or` operators in query should be used
            # as SOLR commands?
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
            # How much lower weights fields score is taken against
            # high weights fields score
            # 0.0 === lower weight field score is treated as
            # high weight field score
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
            # "hl.fl": "title,author_names,description,keywords",
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
        await _check_collection_sanity(client, collection)

    return SolrResponse(collection=collection, data=data)


async def _check_collection_sanity(client, collection):
    """
    Helper function checking if the solr collection is not empty
    in case of solr data request returns a response with no data.
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
    solr_collection = f"{settings.COLLECTIONS_PREFIX}{collection}"
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
) -> Dict:
    """Get item from defined collection based on ID"""
    solr_collection = f"{settings.COLLECTIONS_PREFIX}{collection}"
    url = f"{settings.SOLR_URL}{solr_collection}/get?id={item_id}"
    response = await handle_solr_detail_response_errors(client.get(url))
    response = response.json()

    return response


async def get_item_by_pid(
    client: AsyncClient,
    collection: Collection,
    item_pid: str,
) -> Response:
    """Get item from defined collection based on PID"""
    solr_collection = f"{settings.COLLECTIONS_PREFIX}{collection}"
    url = f"{settings.SOLR_URL}{solr_collection}/query?q=pid:{item_pid}"
    return await handle_solr_list_response_errors(client.get(url))


async def get_related_resource_names(
    client: AsyncClient,
    field: RelatedResourceField,
    ids: list[str],
) -> dict[str, str]:
    """Resolve related service/guideline PIDs to titles."""
    unique_ids = list(dict.fromkeys([item_id for item_id in ids if item_id]))
    if not unique_ids:
        return {}

    names: dict[str, str] = {}
    for collection in [
        RELATED_RESOURCE_COLLECTIONS[field],
        Collection.ALL_COLLECTION,
    ]:
        for id_field in ["pid", "id"]:
            missing_ids = [
                item_id for item_id in unique_ids if item_id not in names
            ]
            if not missing_ids:
                return names

            try:
                names.update(
                    await _query_related_resource_names(
                        client, collection, field, id_field, missing_ids
                    )
                )
            except SolrCollectionNotFoundError:
                if collection != Collection.ALL_COLLECTION:
                    continue
                raise

    return names


async def _query_related_resource_names(
    client: AsyncClient,
    collection: Collection,
    field: RelatedResourceField,
    id_field: str,
    ids: list[str],
) -> dict[str, str]:
    solr_collection = f"{settings.COLLECTIONS_PREFIX}{collection}"
    filter_query = [f"{{!terms f={id_field}}}{','.join(ids)}"]
    if collection == Collection.ALL_COLLECTION:
        filter_query.append(f'type:"{RELATED_RESOURCE_TYPES[field]}"')

    request_body = {
        "params": {
            "q": "*:*",
            "fq": filter_query,
            "fl": f"{id_field},title",
            "rows": len(ids),
            "wt": "json",
        }
    }
    response = await handle_solr_list_response_errors(
        client.post(
            f"{settings.SOLR_URL}{solr_collection}/select",
            json=request_body,
        )
    )

    names = {}
    for doc in response.json()["response"]["docs"]:
        if doc.get(id_field) and doc.get("title"):
            names[str(first_solr_value(doc[id_field]))] = first_solr_value(
                doc["title"]
            )
    return names


def search_dep():
    """FastAPI search method dependency"""
    return search


def search_advanced_dep():
    """FastAPI search method dependency"""
    return search_advanced


def get_dep():
    """get method dependency"""
    return get


def get_related_resource_names_dep():
    """FastAPI related resource name resolver dependency"""
    return get_related_resource_names
