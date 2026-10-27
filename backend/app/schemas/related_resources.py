"""Models for resolving related resource display names"""

from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.solr_response import RelatedService
from app.settings import settings

RelatedResourceField = Literal["related_services", "related_guidelines"]


class RelatedResourceNamesRequest(BaseModel):
    """Request with related resource ids from adapter fields"""

    field: RelatedResourceField = Field(
        ..., description="Adapter relation field to resolve"
    )
    ids: list[str] = Field(
        ..., description="Related service or guideline persistent ids"
    )


class RelatedResourceNamesResponse(BaseModel):
    """Resolved related resource display names keyed by persistent id"""

    names: dict[str, str]


class GuidelineRelatedServicesRequest(BaseModel):
    """Request with guideline ids to enrich with related services."""

    guideline_ids: list[str] = Field(
        ...,
        min_length=1,
        max_length=settings.MAX_RESULTS_BY_PAGE,
        description="Interoperability guideline identifiers",
    )


class GuidelineRelatedServicesResponse(BaseModel):
    """Related services keyed by interoperability guideline id."""

    related_services: dict[str, list[RelatedService]]
