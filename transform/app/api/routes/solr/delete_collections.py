from fastapi import APIRouter, Query, HTTPException

from app.tasks.delete_collections import delete_solr_collections_task
from app.validations.other import validate_date_basic_format
from app.validations.solr import (
    validate_collections,
    validate_pinned_collections,
)
from app.settings import settings

router = APIRouter()


@router.delete("/delete_collections")
async def delete_solr_collections(
    date: str = Query(..., description="Date string in the format 'YYYYMMDD'."),
    collection_prefix: str = Query(
        None, description="Prefix for collection names. Defaults to the empty string"
    ),
):
    """
    Deletes Solr collections for a singular data iteration.
    """
    collection_names = [
        f"{date}_{collection}"
        if collection_prefix is None
        else f"{collection_prefix}_{date}_{collection}"
        for collection in settings.SOLR_COLLECTION_NAMES
    ]

    try:
        validate_date_basic_format(date)
        validate_collections(collection_names, check_existence=False)
        validate_pinned_collections(collection_names)

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    except HTTPException as he:
        raise HTTPException(status_code=he.status_code, detail=str(he.detail))

    task = delete_solr_collections_task.delay(collection_names)

    return {"task_id": task.id}
