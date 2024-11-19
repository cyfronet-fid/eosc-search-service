from fastapi import APIRouter, Query

from app.settings import settings
from app.tasks.solr.create_collections import create_solr_collections_task

router = APIRouter()


@router.post("/create_collections")
async def create_solr_collections(
    solr_url: str = Query(
        settings.SOLR_URL,
        description="Solr address",
    ),
    all_collection_config: str = Query(
        settings.SOLR_ALL_COL_CONF,
        description="Config name for 'all_collection'",
    ),
    catalogue_config: str = Query(
        settings.SOLR_CAT_CONF, description="Config name for 'catalogue'"
    ),
    organisation_config: str = Query(
        settings.SOLR_ORG_CONF, description="Config name for 'organisation'"
    ),
    project_config: str = Query(
        settings.SOLR_PROJ_CONF, description="Config name for 'project'"
    ),
    provider_config: str = Query(
        settings.SOLR_PROVIDER_CONF, description="Config name for 'provider'"
    ),
    collection_prefix: str = Query(
        None,
        description="Prefix for collection names. It is recommended to use convention 'oag<ver>_YYYYMMDD_'",
    ),
    num_shards: int = Query(1, description="Number of shards"),
    replication_factor: int = Query(1, description="Replication factor"),
):
    """Creates Solr collections for a singular data iteration."""
    task = create_solr_collections_task.delay(
        solr_url,
        all_collection_config,
        catalogue_config,
        organisation_config,
        project_config,
        provider_config,
        collection_prefix,
        num_shards,
        replication_factor,
    )

    return {"task_id": task.id}
