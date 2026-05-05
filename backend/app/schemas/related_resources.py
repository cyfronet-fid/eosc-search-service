"""Models for resolving related resource display names"""

from typing import Literal

from pydantic import BaseModel, Field

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
