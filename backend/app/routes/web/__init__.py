"""Routes for the UI"""

from fastapi import APIRouter

from .auth import router as auth_router
from .configuration import router as configuration_router
from .mocks import router as mocks_router
from .presentable import router as presentable_router
from .recommendation import router as recommendation_router
from .search import router as search_router
from .user_actions import router as user_actions_router

web_api_router = APIRouter()
web_api_router.include_router(search_router)
web_api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
web_api_router.include_router(mocks_router, tags=["mocks"])
web_api_router.include_router(user_actions_router, tags=["user_actions"])
web_api_router.include_router(presentable_router)
web_api_router.include_router(recommendation_router, tags=["recommendations"])
web_api_router.include_router(configuration_router, tags=["configuration"])
