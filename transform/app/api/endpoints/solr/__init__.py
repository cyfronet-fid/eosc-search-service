"""Routes for solr"""

from fastapi import APIRouter

from .create_aliases import router as create_aliases_router
from .create_collections import router as create_collections_router
from .delete_collections import router as delete_collections_router

solr_api_router = APIRouter()
solr_api_router.include_router(create_collections_router, tags=["solr"])
solr_api_router.include_router(create_aliases_router, tags=["solr"])
solr_api_router.include_router(delete_collections_router, tags=["solr"])
