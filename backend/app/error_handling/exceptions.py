from fastapi import HTTPException


class RelatedServicesError(HTTPException):
    """Error raised ifcategories Providers Component API returned error status code"""

    def __init__(self, detail, status_code=None):
        super().__init__(status_code=status_code, detail=detail)
