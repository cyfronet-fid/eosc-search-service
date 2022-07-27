"""Routes for the UI"""

from fastapi import APIRouter

from .auth import router as auth_router
from .mocks import router as mocks_router
from .presentable import router as presentable_router
from .search import router as search_router

web_api_router = APIRouter()
web_api_router.include_router(search_router)
web_api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
web_api_router.include_router(mocks_router, tags=["mocks"])
web_api_router.include_router(presentable_router)
