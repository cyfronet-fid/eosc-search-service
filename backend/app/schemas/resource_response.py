# pylint: disable=missing-module-docstring,missing-class-docstring
from typing import Optional

from pydantic import BaseModel


class ResourceResponse(BaseModel):
    imgSrc: Optional[str] = None
    label: str
    rating: int
    description: str
    organisation: str
