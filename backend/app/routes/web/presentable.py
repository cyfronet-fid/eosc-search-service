# pylint: disable=missing-function-docstring

"""Presentable items UI endpoint"""

from fastapi import APIRouter, Depends
from httpx import AsyncClient

from app.generic.models.bad_request import BadRequest
from app.schemas.solr_response import Collection
from app.solr.operations import get_dep

router = APIRouter()


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
    return {
        **response["doc"],
        "facets": response["facets"] if "facets" in response else {},
    }
