# pylint: disable=missing-module-docstring,missing-class-docstring

from typing import Optional

from pydantic import BaseModel


class Presentable(BaseModel):
    id: int | str
    title: list[str]
    description: list[str]
    author_names: Optional[list[str]] = None
    language: Optional[list[str]] = None
    keywords: Optional[list[str]] = None
    license: Optional[str] = None
    best_access_right: Optional[str] = "open_access"
    publication_date: Optional[str] = None
    resource_type: Optional[str] = None
    content_type: Optional[str] = None
    url: Optional[list[str]] = None
    eosc_provider: Optional[str] = None
    format: Optional[list[str]] = None
    level_of_expertise: Optional[str] = None
    target_group: Optional[str] = None
    qualification: Optional[str] = None
    duration: Optional[str] = None
