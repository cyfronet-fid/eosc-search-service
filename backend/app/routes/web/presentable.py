# pylint: disable=missing-function-docstring

"""Presentable items UI endpoint"""

import asyncio
import logging

from fastapi import APIRouter, Depends
from httpx import AsyncClient

from app.generic.models.bad_request import BadRequest
from app.schemas.solr_response import Collection
from app.solr.operations import get_dep
from app.utils.ig_related_services import get_related_services_for_guidelines

logger = logging.getLogger(__name__)

router = APIRouter()

# Max time the detail page waits for related services from the catalogue API
RELATED_SERVICES_TIMEOUT_SECONDS = 2


@router.get(
    "/{collection}/{item_id:path}",
    responses={500: {"model": BadRequest}},
)
async def read_item(
    collection: Collection,
    item_id: str,
    get_item=Depends(get_dep),
):
    async with AsyncClient() as client:
        response = await get_item(client, collection, item_id)
        if collection == Collection.GUIDELINE:
            doc = response["doc"]
            try:
                related = await asyncio.wait_for(
                    get_related_services_for_guidelines(client, [doc["id"]]),
                    timeout=RELATED_SERVICES_TIMEOUT_SECONDS,
                )
            except asyncio.TimeoutError:
                logger.warning(
                    "Related services timed out for guideline %s", doc["id"]
                )
                related = {}
            except Exception as exc:  # pylint: disable=broad-except
                logger.exception(
                    "Related services failed for guideline %s: %s",
                    doc["id"],
                    exc,
                )
                related = {}
            doc["related_services"] = related.get(doc["id"], [])
    return {
        **response["doc"],
        "facets": response["facets"] if "facets" in response else {},
    }
