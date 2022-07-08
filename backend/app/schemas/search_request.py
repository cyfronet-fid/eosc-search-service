"""Search request schema"""

from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field


class TermsFacet(BaseModel):
    """
    The TermsFacet schema.

    It includes selected fields from https://solr.apache.org/guide/8_11/json-facet-api.html.
    """

    type: Literal["terms"]
    field: str
    offset: Optional[int]
    limit: Optional[int]
    sort: Optional[str]
    mincount: Optional[int]
    missing: Optional[bool]
    prefix: Optional[str]
    contains: Optional[str]
    containsIgnoreCase: Optional[str] = Field(alias="contains.ignoreCase", default=None)


class SearchRequest(BaseModel):
    """The search request specification"""

    facets: Optional[dict[str, TermsFacet]]
