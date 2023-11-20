"""Routes for solr"""
from fastapi import APIRouter

from .create_collections import router as create_collections_router

solr_api_router = APIRouter()
solr_api_router.include_router(create_collections_router, tags=["solr"])
