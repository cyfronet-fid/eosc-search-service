"""The UI Search endpoint"""
import itertools
import logging
from json import JSONDecodeError

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from httpx import AsyncClient, TransportError
from requests import Response

from app.schemas.web import SearchRequest
from app.solr.operations import get, search_dep

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
    sort: list[str] = Query(
        [], description="Sort order", example=["description asc", "name desc"]
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
    async with AsyncClient() as client:
        response = await handle_search_errors(
            search(
                client,
                collection,
                q=q,
                qf=qf,
                fq=fq,
                sort=sort + DEFAULT_SORT,
                rows=rows,
                cursor=cursor,
                facets=request.facets,
            )
        )

        res_json = response.json()

        if "all_collection" in collection or "bundle" in collection:
            await extend_results_with_bundles(client, res_json, collection)

    out = {
        "results": res_json["response"]["docs"],
        "numFound": res_json["response"]["numFound"],
        "nextCursorMark": res_json["nextCursorMark"],
    }

    if "facets" in res_json:
        out["facets"] = res_json["facets"]

    if "highlighting" in res_json:
        out["highlighting"] = res_json["highlighting"]

    return out


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
