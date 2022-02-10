"""Schemas for responses for UI"""

from pydantic import BaseModel


class SearchResults(BaseModel):
    """Search results"""

    results: list
    next_cursor_mark: str
