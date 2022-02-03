# pylint: disable=missing-module-docstring,missing-class-docstring
from pydantic import BaseModel


class SearchResultResponse(BaseModel):
    label: str
    value: str
