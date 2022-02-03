# pylint: disable=missing-module-docstring,missing-class-docstring
from pydantic import BaseModel


class LabelResponse(BaseModel):
    label: str
    count: int
