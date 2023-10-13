"""Model for solr response for facets request"""

from pydantic import BaseModel


class FacetResponse(BaseModel):
    """Model representing single value in facets response"""

    name: str
    count: int
