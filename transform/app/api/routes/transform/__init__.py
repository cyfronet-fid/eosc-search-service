"""Routes for transform"""

from fastapi import APIRouter

from .batch import router as batch_router
from .full import router as full_router

transform_api_router = APIRouter()
transform_api_router.include_router(batch_router, tags=["transform"])
transform_api_router.include_router(full_router, tags=["transform"])
