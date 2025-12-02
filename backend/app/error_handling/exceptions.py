"""Custom exceptions related to provide components"""

from fastapi import HTTPException


class RelatedServicesError(HTTPException):
    """Errors raised if categories from Providers Component API returned error status code"""

    def __init__(self, detail, status_code=None):
        super().__init__(status_code=status_code, detail=detail)
