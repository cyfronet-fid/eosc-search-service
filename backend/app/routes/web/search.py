# pylint: disable=fixme

"""The UI Search endpoint"""
import itertools
import logging
from contextlib import suppress
from typing import Optional

from fastapi import APIRouter, Body, Depends, Query, Request
from httpx import AsyncClient

from app.consts import DEFAULT_SORT, SORT_UI_TO_SORT_MAP, SortUi
from app.routes.web.recommendation import sort_by_relevance
from app.schemas.search_request import SearchRequest
from app.schemas.solr_response import Collection
from app.solr.error_handling import SolrDocumentNotFoundError
from app.solr.operations import get, search_advanced_dep, search_dep

router = APIRouter()

logger = logging.getLogger(__name__)


# pylint: disable=too-many-arguments, too-many-locals
@router.post("/search-results", name="web:post-search")
async def search_post(
    request_session: Request,
    collection: Collection = Query(..., description="Collection"),
    q: str = Query(..., description="Free-form query string"),
    qf: str = Query(..., description="Query fields"),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
    exact: str = Query(..., description="Exact match"),
    sort_ui: SortUi = "default",
    sort: list[str] = Query(
        [], description="Solr sort", example=["description asc", "name desc"]
    ),
    rows: int = Query(10, description="Row count", gte=3, le=100),
    cursor: str = Query("*", description="Cursor"),
    request: SearchRequest = Body(..., description="Request body"),
    search=Depends(search_dep),
):
    """
    Do a search against the specified collection.

    The q, qf, fq, sort params correspond to
    https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html.
    Paging is cursor-based, see
    https://solr.apache.org/guide/8_11/pagination-of-results.html#fetching-a-large-number-of-sorted-results-cursors.
    """
    final_solr_sorting = await define_sorting(sort_ui, sort, collection)

    if request.facets is not None and len(request.facets) > 0:
        if "title" in request.facets:
            request.facets = None

    async with AsyncClient(timeout=None) as client:
        response = await search(
            client,
            collection,
            q=q,
            qf=qf,
            fq=fq,
            sort=final_solr_sorting,
            rows=rows,
            exact=exact,
            cursor=cursor,
            facets=request.facets,
        )
        res_json = response.data

        # Extent the results with bundles
        if collection in [Collection.ALL_COLLECTION, Collection.BUNDLE]:
            await extend_results_with_bundles(client, res_json)
    collection = response.collection
    out = await create_output(request_session, res_json, collection, sort_ui)
    return out


# pylint: disable=too-many-arguments
@router.post("/search-results-advanced", name="web:post-search")
async def search_post_advanced(
    request_session: Request,
    collection: str = Query(..., description="Collection"),
    q: str = Query(..., description="Free-form query string"),
    qf: str = Query(..., description="Query fields"),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
    exact: str = Query(..., description="Exact match"),
    sort_ui: SortUi = "default",
    sort: list[str] = Query(
        [], description="Solr sort", example=["description asc", "name desc"]
    ),
    rows: int = Query(10, description="Row count", gte=3, le=100),
    cursor: str = Query("*", description="Cursor"),
    request: SearchRequest = Body(..., description="Request body"),
    search=Depends(search_advanced_dep),
):
    """
    Do a search against the specified collection.

    The q, qf, fq, sort params correspond to
    https://solr.apache.org/guide/8_11/query-syntax-and-parsing.html.
    Paging is cursor-based, see
    https://solr.apache.org/guide/8_11/pagination-of-results.html#fetching-a-large-number-of-sorted-results-cursors.
    """
    final_solr_sorting = await define_sorting(sort_ui, sort, collection)
    async with AsyncClient(timeout=None) as client:
        response = await search(
            client,
            collection,
            q=q,
            qf=qf,
            fq=fq,
            sort=final_solr_sorting,
            rows=rows,
            exact=exact,
            cursor=cursor,
            facets=request.facets,
        )

        res_json = response.data

        # Extent the results with bundles
        if collection in [Collection.ALL_COLLECTION, Collection.BUNDLE]:
            await extend_results_with_bundles(client, res_json)
    collection = response.collection
    out = await create_output(request_session, res_json, collection, sort_ui)
    return out


async def create_output(
    request_session: Request, res_json: dict, collection: Collection, sort_ui: str
) -> dict:
    """Create an output"""
    out = {
        "numFound": res_json["response"]["numFound"],
        "nextCursorMark": res_json["nextCursorMark"],
    }

    if sort_ui == "r":
        # Sort by relevance
        rel_sorted_items = await sort_by_relevance(
            request_session, collection, res_json["response"]["docs"]
        )
        out["results"] = rel_sorted_items["recommendations"]
        out["numFound"] = len(out["results"])
        if not out["numFound"]:
            out["nextCursorMark"] = "*"

    else:
        out["results"] = res_json["response"]["docs"]
    if "facets" in res_json:
        out["facets"] = res_json["facets"]

    if "highlighting" in res_json:
        out["highlighting"] = res_json["highlighting"]

    return out


# pylint: disable=logging-fstring-interpolation, too-many-locals, useless-suppression
async def extend_results_with_bundles(client, res_json):
    """Extend bundles in search results with information about offers and services"""

    bundle_results = list(
        filter(lambda doc: doc["type"] == "bundle", res_json["response"]["docs"])
    )
    if bundle_results:
        # Combine main offer with other offers
        bundle_offers = [
            (
                [bundle["main_offer_id"]] + bundle["offer_ids"]
                if bundle.get("offer_ids")
                else [bundle["main_offer_id"]]
            )
            for bundle in bundle_results
        ]
        offer_ids = set(itertools.chain(*bundle_offers))

        # Extend bundles with offers and services data
        if offer_ids:
            offers = {}
            offer_results = []
            for offer_id in offer_ids:
                with suppress(SolrDocumentNotFoundError):
                    response = await get(client, Collection.OFFER, offer_id)
                    item = response["doc"]
                    if item is None:
                        logger.warning(f"No offer with id={offer_id}")
                        continue
                    offer_results.append(item)

            services_ids: set[int] = set()

            for offer in offer_results:
                offers[offer["id"]] = offer
                services_ids.add(offer["service_id"])

            services = {}
            service_results = []
            for service_id in services_ids:
                with suppress(SolrDocumentNotFoundError):
                    response = await get(client, Collection.SERVICE, service_id)
                    item = response["doc"]
                    if item is None:
                        logger.warning(f"No service with id={service_id}")
                        continue
                    service_results.append(item)
            for service in service_results:
                services[str(service["id"])] = service
            for offer in offer_results:
                offer["service"] = services.get(str(offer["service_id"]), None)
            for bundle in bundle_results:
                bundle["offers"] = [
                    offers.get(str(offer_id))
                    for offer_id in (
                        [bundle.get("main_offer_id")] + (bundle.get("offer_ids") or [])
                    )
                ]
    else:
        return


async def define_sorting(
    sort_ui: SortUi, sort: list[str], collection: Optional[str] = None
):
    """Retrieve proper solr sorting based on sort_ui param"""

    additional_sorts = SORT_UI_TO_SORT_MAP.get(sort_ui)
    final_sorting = (
        sort + DEFAULT_SORT
        if additional_sorts is None
        else additional_sorts + DEFAULT_SORT
    )

    # TODO: This is a workaround. Remove once bundles have been fixed.
    # https://github.com/cyfronet-fid/eosc-search-service/issues/754
    if Collection.ALL_COLLECTION in collection:
        return ['if(eq(type, "bundle"), 1, 0) asc'] + final_sorting

    return final_sorting
