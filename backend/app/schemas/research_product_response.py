"""Models used by web.research_product.py"""

from pydantic import BaseModel

from app.consts import ResearchProductType
from app.settings import Url


class RPUrlPath(BaseModel):
    """Model ensuring url is a valid url"""

    url: Url


class ResearchProductResponse(BaseModel):
    """Model of response for research_product endpoint"""

    title: str
    links: list[Url]
    author: list[str]
    type: ResearchProductType
    best_access_right: str
