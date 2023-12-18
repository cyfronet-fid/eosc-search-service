from datetime import datetime
from fastapi import APIRouter, Query, HTTPException

from app.tasks.create_collections import create_solr_collections_task
from app.transform.schemas.properties.env import SOLR_COLLECTION_NAMES
from app.validations.other import validate_date_basic_format
from app.validations.solr import (
    validate_collections,
    validate_configset_exists,
)

router = APIRouter()


@router.post("/create_collections")
async def create_solr_collections(
    all_collection_config: str = Query(
        ...,
        description="Config name for all_collection except for providers",
    ),
    provider_config: str = Query(..., description="Config name for 'provider'"),
    collection_prefix: str = Query(
        None,
        description="Prefix for collection names. It is recommended to use convention 'oag<dump_version>'",
    ),
    date: str = Query(
        None,
        description="Date string in the format 'YYYYMMDD'. "
        "Defaults to the current date if not provided.",
    ),
    num_shards: int = Query(1, description="Number of shards"),
    replication_factor: int = Query(1, description="Replication factor"),
):
    """
    Creates Solr collections for a singular data iteration.
    """
    date = date or datetime.now().strftime("%Y%m%d")

    collection_names = [
        f"{date}_{collection}"
        if collection_prefix is None
        else f"{collection_prefix}_{date}_{collection}"
        for collection in SOLR_COLLECTION_NAMES
    ]

    try:
        validate_date_basic_format(date)
        validate_configset_exists(all_collection_config)
        validate_configset_exists(provider_config)
        validate_collections(collection_names, check_existence=True)

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    except HTTPException as he:
        raise HTTPException(status_code=he.status_code, detail=str(he.detail))

    task = create_solr_collections_task.delay(
        all_collection_config,
        provider_config,
        collection_names,
        num_shards,
        replication_factor,
    )

    return {"task_id": task.id}
