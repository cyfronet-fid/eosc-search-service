"""Models used by web.research_product.py"""
from typing import List

from pydantic import AnyUrl, BaseModel

from app.consts import ResearchProductCollection


class ResearchProductResponse(BaseModel):
    """Model of response for research_product endpoint"""

    title: str
    links: List[AnyUrl]
    author: List[str]
    type: ResearchProductCollection
