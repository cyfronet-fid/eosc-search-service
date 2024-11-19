from fastapi import APIRouter, HTTPException, Query

from app.services.solr.validate.endpoints.validate import (
    validate_collections,
    validate_pinned_collections,
)
from app.settings import settings
from app.tasks.solr.delete_collections import delete_solr_collections_task

router = APIRouter()


@router.delete("/delete_collections")
async def delete_solr_collections(
    solr_url: str = Query(
        settings.SOLR_URL,
        description="Solr address",
    ),
    collection_prefix: str = Query(
        description="Prefix for collection names. Usually 'oag<ver>_YYYYMMDD_'"
    ),
):
    """
    Deletes Solr collections for a singular data iteration.
    """
    collection_names = [
        (f"{collection_prefix}{collection}")
        for collection in settings.SOLR_COLLECTION_NAMES
    ]

    try:
        validate_collections(collection_names, check_existence=False)
        validate_pinned_collections(collection_names)

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    except HTTPException as he:
        raise HTTPException(status_code=he.status_code, detail=str(he.detail))

    task = delete_solr_collections_task.delay(solr_url, collection_names)

    return {"task_id": task.id}
