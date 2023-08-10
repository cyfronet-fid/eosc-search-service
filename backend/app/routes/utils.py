"""Common routes code"""

from fastapi import APIRouter

# There must be a unique field in the sort for the cursor paging to work.
DEFAULT_SORT = ["score desc", "id asc"]

internal_api_router = APIRouter()


# pylint: disable=too-many-return-statements
async def parse_col_name(collection: str) -> str | None:
    """Parse collection name for sort by relevance"""
    # Handle prefixes
    if "all" in collection:
        return "all"
    if "publication" in collection:
        return "publication"
    if "dataset" in collection:
        return "dataset"
    if "software" in collection:
        return "software"
    if "service" in collection:
        return "service"
    if "data_source" in collection:
        return "data_source"
    if "training" in collection:
        return "training"
    if "guideline" in collection:
        return "guideline"
    if "bundle" in collection:
        return "bundle"
    if "other" in collection:
        return "other"
    if "provider" in collection:
        return "provider"
    return None
