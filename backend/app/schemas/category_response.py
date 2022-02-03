# pylint: disable=missing-module-docstring,missing-class-docstring
from pydantic import BaseModel


class CategoryResponse(BaseModel):
    label: str
    count: str
