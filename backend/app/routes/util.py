"""Common routes code"""

from fastapi import APIRouter

# There must be a unique field in the sort for the cursor paging to work.
DEFAULT_SORT = ["score desc", "id asc"]

internal_api_router = APIRouter()
