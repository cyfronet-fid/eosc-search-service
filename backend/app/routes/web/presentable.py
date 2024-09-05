# pylint: disable=missing-function-docstring

"""Presentable items UI endpoint"""
from typing import Annotated

from fastapi import APIRouter, Depends, Header
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
    collections_prefix: Annotated[str | None, Header()] = None,
):
    async with AsyncClient() as client:
        response = await get_item(client, collection, item_id, collections_prefix)
        if collection == Collection.GUIDELINE:
            await extend_ig_with_related_services(
                client=client,
                docs=[response["doc"]],
                collections_prefix=collections_prefix,
            )
    return {
        **response["doc"],
        "facets": response["facets"] if "facets" in response else {},
    }
