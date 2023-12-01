from datetime import datetime
from fastapi import APIRouter, Query, HTTPException

from app.transform.schemas.properties.env import SOLR_COLLECTION_NAMES
from app.tasks.create_aliases import create_aliases_task
from app.validations.other import validate_date_basic_format
from app.validations.solr import validate_collections

router = APIRouter()


@router.post("/create_aliases")
async def create_aliases(
    collection_date: str = Query(
        None,
        description="Date string in the format 'YYYYMMDD'. Defaults to the current date if not provided.",
    ),
    collection_prefix: str = Query(
        "",
        description="Prefix for collection names. It is recommended to use convention 'oag<dump_version>'",
    ),
    alias_prefix: str = Query("", description="Prefix for aliases."),
):
    """
    Creates or switches aliases for a singular data iteration.
    """
    collection_date = collection_date or datetime.now().strftime("%Y%m%d")

    aliases = (
        SOLR_COLLECTION_NAMES
        if alias_prefix == ""
        else [f"{alias_prefix}_{collection}" for collection in SOLR_COLLECTION_NAMES]
    )

    collection_names = [
        f"{collection_date}_{collection}"
        if collection_prefix == ""
        else f"{collection_prefix}_{collection_date}_{collection}"
        for collection in SOLR_COLLECTION_NAMES
    ]

    try:
        validate_date_basic_format(collection_date)
        validate_collections(collection_names, check_existence=False)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    task = create_aliases_task.delay(aliases, collection_names)

    return {"task_id": task.id}