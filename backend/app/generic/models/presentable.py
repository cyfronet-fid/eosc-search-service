# pylint: disable=missing-module-docstring,missing-class-docstring

from typing import Optional

from pydantic import BaseModel


class Presentable(BaseModel):
    id: int | str
    Resource_title_s: str
    Description_s: str
    Author_ss: list[str]
    Language_s: str
    Keywords_ss: list[str]
    License_s: str
    Access_Rights_s: str
    Version_date__created_in__s: str
    Resource_Type_s: str
    Content_Type_s: str
    URL_s: str
    EOSC_PROVIDER_s: str
    Format_ss: list[str]
    Level_of_expertise_s: str
    Target_group_s: str
    Qualification_s: str
    Duration_s: str
    facets: Optional[dict] = None
