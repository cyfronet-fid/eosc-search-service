"""Recommend request schema"""

from datetime import datetime

from pydantic import BaseModel


class RecommendRequest(BaseModel):
    """POST /recommend request"""

    unique_id: str
    timestamp: datetime
    visit_id: str
    page_id: str
    panel_id: str
