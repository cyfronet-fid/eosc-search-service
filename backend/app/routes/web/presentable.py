# pylint: disable=missing-function-docstring

"""Presentable items UI endpoint"""
from typing import Optional

from fastapi import APIRouter, Depends
from httpx import AsyncClient

from app.generic.models.bad_request import BadRequest
from app.schemas.solr_response import Collection
from app.solr.operations import get_dep
from app.utils.ig_related_services import extend_ig_with_related_services

router = APIRouter()


@router.get(
    "/{collection}/{item_id}",
    responses={500: {"model": BadRequest}},
)
async def read_item(
    collection: Collection,
    item_id: int | str,
    get_item=Depends(get_dep),
    scope: Optional[str] = None,
):

    async with AsyncClient() as client:
        response = await get_item(client, collection, item_id, scope)
        if collection == Collection.GUIDELINE:
            await extend_ig_with_related_services(
                client=client,
                docs=[response["doc"]],
                scope=scope,
            )
    return {
        **response["doc"],
        "facets": response["facets"] if "facets" in response else {},
    }
