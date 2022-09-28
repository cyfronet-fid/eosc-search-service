# pylint: disable=missing-module-docstring,missing-class-docstring

from typing import Optional

from pydantic import BaseModel


class Presentable(BaseModel):
    id: int | str
    Resource_title_s: str
    Description_s: str
    Author_ss: Optional[list[str]] = None
    language: str
    Keywords_ss: list[str]
    License_s: str
    Access_Rights_s: Optional[str] = "open_access"
    Version_date__created_in__s: Optional[str] = None
    resource_type: str
    content_type: str
    URL_s: str
    eosc_provider: str
    format: list[str]
    Level_of_expertise_s: Optional[str] = None
    Target_group_s: Optional[str] = None
    Qualification_s: Optional[str] = None
    Duration_s: Optional[str] = None
    facets: Optional[dict] = None
