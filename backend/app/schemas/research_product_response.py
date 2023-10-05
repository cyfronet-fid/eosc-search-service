"""Models used by web.research_product.py"""
from pydantic import AnyUrl, BaseModel

from app.consts import ResearchProductType


class ResearchProductResponse(BaseModel):
    """Model of response for research_product endpoint"""

    title: str
    links: list[AnyUrl]
    author: list[str]
    type: ResearchProductType
