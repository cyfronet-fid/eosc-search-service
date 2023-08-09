"""Models used by web.research_product.py"""
from typing import List, Literal, TypeAlias

from pydantic import AnyUrl, BaseModel

ResourceType: TypeAlias = Literal["publication", "dataset", "software", "other"]
Collection: TypeAlias = Literal["publication", "dataset", "software", "other_rp"]


class ResearchProductResponse(BaseModel):
    """Model of response for research_product endpoint"""

    title: str
    links: List[AnyUrl]
    author: List[str]
    type: ResourceType
