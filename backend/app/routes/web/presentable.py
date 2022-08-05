# pylint: disable=missing-function-docstring

""" Presentable items UI endpoint """

from json import JSONDecodeError

from fastapi import APIRouter, Depends, HTTPException
from httpx import AsyncClient, TransportError

from app.generic.models.bad_request import BadRequest
from app.generic.models.presentable import Presentable
from app.solr.operations import get_dep

router = APIRouter()


@router.get(
    "/{collection}/{item_id}",
    response_model=Presentable,
    responses={500: {"model": BadRequest}},
)
async def read_item(
    collection: str,
    item_id: int | str,
    get_item=Depends(get_dep),
):
    async with AsyncClient() as client:
        try:
            response = await get_item(client, collection, item_id)
        except TransportError as e:
            raise HTTPException(status_code=500, detail="Try again later") from e
    if response.is_error:
        try:
            detail = response.json()["error"]["msg"]
        except (KeyError, JSONDecodeError):
            detail = None
        raise HTTPException(status_code=response.status_code, detail=detail)
    res_json = response.json()
    return {
        **res_json["doc"],
        "facets": res_json["facets"] if "facets" in res_json else {},
    }
