"""The APIs"""
from fastapi import APIRouter

from app.routes.mocks import router as mocks_router
from app.routes.web_auth import router as auth_router

from .recommend import recommend_post
from .search import search_get
from .util import internal_api_router

web_api_router = APIRouter()
web_api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
web_api_router.include_router(mocks_router, tags=["mocks"])
