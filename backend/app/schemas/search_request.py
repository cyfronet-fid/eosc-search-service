# pylint: disable=missing-module-docstring,missing-class-docstring, too-few-public-methods

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Literal, Optional

from pydantic import BaseModel, Field


class _ISolrSerializable(ABC):
    @abstractmethod
    def serialize_to_solr_format(self):
        """
        Serializes the pydantic module to the format
        that is accepted in the SOLR /select API
        """


class TermsFacet(BaseModel, _ISolrSerializable):
    """
    The TermsFacet schema.

    It includes selected fields from https://solr.apache.org/guide/8_11/json-facet-api.html.
    """

    type: Literal["terms"]
    field: str
    offset: Optional[int] = None
    limit: Optional[int] = None
    sort: Optional[str] = None
    mincount: Optional[int] = None
    missing: Optional[bool] = None
    prefix: Optional[str] = None
    contains: Optional[str] = None
    containsIgnoreCase: Optional[str] = Field(alias="contains.ignoreCase", default=None)

    def serialize_to_solr_format(self) -> dict:
        return self.dict()


class StatFacet(BaseModel, _ISolrSerializable):
    expression: str

    def serialize_to_solr_format(self) -> str:
        return self.expression


class SearchRequest(BaseModel):
    """The search request specification"""

    facets: Optional[dict[str, TermsFacet | StatFacet]] = None


class SearchResults(BaseModel):
    """Search results"""

    results: list
    next_cursor_mark: str
