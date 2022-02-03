# pylint: disable=missing-module-docstring,missing-class-docstring

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel


class FilterNodeResponse(BaseModel):
    title: str
    key: str
    expanded: Optional[bool]
    isLeaf: Optional[bool]
    children: Optional[List[FilterNodeResponse]]


class FilterResponse(BaseModel):
    label: str
    field: str
    collection: str
    nodes: List[FilterNodeResponse]
