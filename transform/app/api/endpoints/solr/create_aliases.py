from datetime import datetime

from fastapi import APIRouter, HTTPException, Query

from app.services.solr.validate.endpoints.validate import (
    validate_collections,
    validate_date_basic_format,
)
from app.settings import settings
from app.tasks.solr.create_aliases import create_aliases_task

router = APIRouter()


@router.post("/create_aliases")
async def create_aliases(
    solr_url: str = Query(
        settings.SOLR_URL,
        description="Solr address",
    ),
    collection_date: str = Query(
        None,
        description="Date string in the format 'YYYYMMDD'. Defaults to the current date if not provided.",
    ),
    collection_prefix: str = Query(
        None,
        description="Prefix for collection names. It is recommended to use convention 'oag<dump_version>'",
    ),
    alias_prefix: str = Query(None, description="Prefix for aliases."),
):
    """
    Creates or switches aliases for a singular data iteration.
    """
    collection_date = collection_date or datetime.now().strftime("%Y%m%d")
    aliases = (
        settings.SOLR_COLLECTION_NAMES
        if alias_prefix is None
        else [
            f"{alias_prefix}_{collection}"
            for collection in settings.SOLR_COLLECTION_NAMES
        ]
    )

    collection_names = [
        (
            f"{collection_date}_{collection}"
            if collection_prefix == ""
            else f"{collection_prefix}_{collection_date}_{collection}"
        )
        for collection in settings.SOLR_COLLECTION_NAMES
    ]

    try:
        validate_date_basic_format(collection_date)
        validate_collections(collection_names, check_existence=False)

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    except HTTPException as he:
        raise HTTPException(status_code=he.status_code, detail=str(he.detail))

    task = create_aliases_task.delay(None, solr_url, aliases, collection_names)

    return {"task_id": task.id}
