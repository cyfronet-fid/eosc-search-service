"""The UI related resources endpoint"""

from fastapi import APIRouter, Body, Depends
from httpx import AsyncClient

from app.schemas.related_resources import (
    RelatedResourceNamesRequest,
    RelatedResourceNamesResponse,
)
from app.solr.operations import get_related_resource_names_dep

router = APIRouter()


@router.post(
    "/related-resources/names",
    name="web:post-related-resource-names",
    response_model=RelatedResourceNamesResponse,
)
async def related_resource_names(
    request: RelatedResourceNamesRequest = Body(...),
    get_names=Depends(get_related_resource_names_dep),
):
    """Resolve related service/guideline ids to display titles."""
    async with AsyncClient() as client:
        names = await get_names(client, request.field, request.ids)
    return RelatedResourceNamesResponse(names=names)
