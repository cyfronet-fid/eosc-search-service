"""Models used by web.research_product.py"""
from pydantic import AnyUrl, BaseModel

from app.consts import ResearchProductType


class RPUrlPath(BaseModel):
    """Model ensuring url is a valid url"""

    url: AnyUrl


class ResearchProductResponse(BaseModel):
    """Model of response for research_product endpoint"""

    title: str
    links: list[AnyUrl]
    author: list[str]
    type: ResearchProductType
