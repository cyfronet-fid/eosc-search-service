from datetime import datetime

from fastapi import APIRouter, HTTPException, Query

from app.services.solr.validate.endpoints.validate import validate_collections
from app.settings import settings
from app.tasks.solr.create_aliases import create_aliases_task

router = APIRouter()


@router.post("/create_aliases")
async def create_aliases(
    solr_url: str = Query(
        settings.SOLR_URL,
        description="Solr address",
    ),
    collection_prefix: str = Query(
        None,
        description="Prefix for collection names. It is recommended to use convention 'oag<ver>_YYYYMMDD_'",
    ),
    alias_prefix: str = Query(None, description="Prefix for aliases."),
):
    """Creates or switches aliases for a single data iteration."""
    aliases = (
        settings.SOLR_COLLECTION_NAMES
        if alias_prefix is None
        else [
            f"{alias_prefix}_{collection}"
            for collection in settings.SOLR_COLLECTION_NAMES
        ]
    )

    collection_names = [
        (f"{collection_prefix}{collection}")
        for collection in settings.SOLR_COLLECTION_NAMES
    ]

    try:
        validate_collections(collection_names, check_existence=False)

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    except HTTPException as he:
        raise HTTPException(status_code=he.status_code, detail=str(he.detail))

    task = create_aliases_task.delay(solr_url, aliases, collection_names)

    return {"task_id": task.id}
