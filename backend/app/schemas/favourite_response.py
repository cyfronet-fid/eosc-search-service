"""Favourite response schema"""

from pydantic import BaseModel
from typing import Literal


class FavouriteResponse(BaseModel):
    """GET /favourites request"""
    pid: str
    resource_type: Literal[
        "adapter",
        "service",
        "publication",
        "dataset",
        "training",
        "software",
        "data source",
        "data-source",
        "other",
        "guideline",
        "bundle",
        "provider",
        "project",
        "organisation",
        "catalogue",
        "deployable service",
        "deployable-service",
    ]
