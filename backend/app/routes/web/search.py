"""The UI Search endpoint"""
import itertools
import logging
from json import JSONDecodeError

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from httpx import AsyncClient, TransportError
from pydantic.typing import Literal
from requests import Response

from app.routes.web.recommendation import sort_by_relevance
from app.schemas.web import SearchRequest
from app.solr.operations import get, search_dep, search_advanced_dep

from ..util import DEFAULT_SORT

router = APIRouter()

logger = logging.getLogger(__name__)


# pylint: disable=too-many-arguments
@router.post("/search-results", name="web:post-search")
async def search_post(
    collection: str = Query(..., description="Collection"),
    q: str = Query(..., description="Free-form query string"),
    qf: str = Query(..., description="Query fields"),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
    sort_ui: str = Literal[
        "dmr",
        "dlr",
        "mp",
        "r",
        "default",
    ],
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
    final_solr_sorting = await define_sorting(sort_ui, sort)

    async with AsyncClient() as client:
        response = await handle_search_errors(
            search(
                client,
                collection,
                q=q,
                qf=qf,
                fq=fq,
                sort=final_solr_sorting,
                rows=rows,
                cursor=cursor,
                facets=request.facets,
            )
        )

        res_json = response.json()

        # Extent the results with bundles
        if "all_collection" in collection or "bundle" in collection:
            await extend_results_with_bundles(client, res_json, collection)

    out = await create_output(res_json, collection, sort_ui)
    return out


# pylint: disable=too-many-arguments
@router.post("/search-results-adv", name="web:post-search")
async def search_post_adv(
    collection: str = Query(..., description="Collection"),
    q: str = Query(..., description="Free-form query string"),
    qf: str = Query(..., description="Query fields"),
    fq: list[str] = Query(
        [],
        description="Filter query",
        example=["journal:Geonomos", 'journal:"Solar Energy"'],
    ),
    sort_ui: str = Literal[
        "dmr",
        "dlr",
        "mp",
        "r",
        "default",
    ],
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
    final_solr_sorting = await define_sorting(sort_ui, sort)
    async with AsyncClient() as client:
        response = await handle_search_errors(
            search(
                client,
                collection,
                q=q,
                qf=qf,
                fq=fq,
                sort=final_solr_sorting,
                rows=rows,
                cursor=cursor,
                facets=request.facets,
            )
        )

        res_json = response.json()

        # Extent the results with bundles
        if "all_collection" in collection or "bundle" in collection:
            await extend_results_with_bundles(client, res_json, collection)

    out = await create_output(res_json, collection, sort_ui)
    return out


async def create_output(res_json: dict, collection: str, sort_ui: str) -> dict:
    """Create an output"""
    out = {
        "numFound": res_json["response"]["numFound"],
        "nextCursorMark": res_json["nextCursorMark"],
    }

    if sort_ui == "r":
        # Sort by relevance
        collection = await parse_col_name(collection)
        rel_sorted_items = await sort_by_relevance(
            collection, res_json["response"]["docs"]
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


# pylint: disable=too-many-return-statements
async def parse_col_name(collection: str) -> str | None:
    """Parse collection name for sort by relevance"""
    # Handle prefixes
    if "all" in collection:
        return "all"
    if "publication" in collection:
        return "publication"
    if "dataset" in collection:
        return "dataset"
    if "software" in collection:
        return "software"
    if "service" in collection:
        return "service"
    if "data-source" in collection:
        return "data-source"
    if "training" in collection:
        return "training"
    if "guideline" in collection:
        return "guideline"
    if "bundle" in collection:
        return "bundle"
    if "other" in collection:
        return "other"
    return None


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


# pylint: disable=logging-fstring-interpolation, too-many-locals, useless-suppression
async def extend_results_with_bundles(client, res_json, collection: str):
    """Extend bundles in search results with information about offers and services"""

    async def get_col_prefix() -> str | None:
        """Get collection prefix"""
        if "all_collection" in collection:
            return collection.split("all_collection")[0]
        if "bundle" in collection:
            return collection.split("bundle")[0]
        return None

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
                offer_col_name = await get_col_prefix() + "offer"
                response = (await get(client, offer_col_name, offer_id)).json()
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
                service_col_name = await get_col_prefix() + "service"
                response = (await get(client, service_col_name, service_id)).json()
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


async def define_sorting(sort_ui: str, sort: list[str]):
    """Retrieve proper solr sorting based on sort_ui param"""
    match sort_ui:
        case "dmr":
            return ["publication_date desc"] + DEFAULT_SORT
        case "dlr":
            return ["publication_date asc"] + DEFAULT_SORT
        case "mp":
            return [
                "usage_counts_views desc",
                "usage_counts_downloads desc",
            ] + DEFAULT_SORT
        case "r":
            # Sort by relevance the most popular resources
            return [
                "usage_counts_views desc",
                "usage_counts_downloads desc",
            ] + DEFAULT_SORT
        case "default":
            return DEFAULT_SORT
        case _:
            return sort + DEFAULT_SORT
