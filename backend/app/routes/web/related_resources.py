"""The UI related resources endpoint"""

from fastapi import APIRouter, Body, Depends
from httpx import AsyncClient

from app.schemas.related_resources import (
    GuidelineRelatedServicesRequest,
    GuidelineRelatedServicesResponse,
    RelatedResourceNamesRequest,
    RelatedResourceNamesResponse,
)
from app.solr.operations import get_related_resource_names_dep
from app.utils.ig_related_services import get_related_services_for_guidelines

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


@router.post(
    "/related-resources/guideline-services",
    name="web:post-guideline-related-services",
    response_model=GuidelineRelatedServicesResponse,
)
async def guideline_related_services(
    request: GuidelineRelatedServicesRequest = Body(...),
):
    """Optionally enrich guidelines without blocking search results."""
    async with AsyncClient(timeout=5.0) as client:
        related_services = await get_related_services_for_guidelines(
            client, request.guideline_ids
        )
    return GuidelineRelatedServicesResponse(related_services=related_services)
