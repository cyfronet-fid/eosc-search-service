from datetime import datetime

from fastapi import APIRouter, HTTPException, Query

from app.services.solr.validate import validate_collections, validate_configset_exists
from app.settings import settings
from app.tasks.create_collections import create_solr_collections_task
from app.transform.utils.validate import validate_date_basic_format

router = APIRouter()


@router.post("/create_collections")
async def create_solr_collections(
    all_collection_config: str = Query(
        ...,
        description="Config name for all_collection except for providers",
    ),
    catalogue_config: str = Query(..., description="Config name for catalogue"),
    organisation_config: str = Query(..., description="Config name for 'organisation'"),
    project_config: str = Query(..., description="Config name for 'project'"),
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
        (
            f"{date}_{collection}"
            if collection_prefix is None
            else f"{collection_prefix}_{date}_{collection}"
        )
        for collection in settings.SOLR_COLLECTION_NAMES
    ]

    try:
        validate_date_basic_format(date)
        validate_configset_exists(all_collection_config)
        validate_configset_exists(catalogue_config)
        validate_configset_exists(organisation_config)
        validate_configset_exists(project_config)
        validate_configset_exists(provider_config)
        validate_collections(collection_names, check_existence=True)

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    except HTTPException as he:
        raise HTTPException(status_code=he.status_code, detail=str(he.detail))

    task = create_solr_collections_task.delay(
        all_collection_config,
        catalogue_config,
        organisation_config,
        project_config,
        provider_config,
        collection_names,
        num_shards,
        replication_factor,
    )

    return {"task_id": task.id}
