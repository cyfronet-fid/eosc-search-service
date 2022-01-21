"""The APIs"""
from fastapi import APIRouter

from app.routes.auth import router as auth_router

from .recommend import recommend_post
from .search import search_get
from .util import internal_api_router

custom_router = APIRouter()
custom_router.include_router(auth_router, prefix="/auth", tags=["auth"])
