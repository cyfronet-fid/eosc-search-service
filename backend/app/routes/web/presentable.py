# pylint: disable=missing-function-docstring

""" Presentable items UI endpoint """

from fastapi import APIRouter, Depends
from httpx import AsyncClient

from app.generic.models.bad_request import BadRequest
from app.solr.operations import get_dep

router = APIRouter()


@router.get(
    "/{collection}/{item_id}",
    responses={500: {"model": BadRequest}},
)
async def read_item(
    collection: str,
    item_id: int | str,
    get_item=Depends(get_dep),
):
    async with AsyncClient() as client:
        response = await get_item(client, collection, item_id)

    return {
        **response["doc"],
        "facets": response["facets"] if "facets" in response else {},
    }
