"""Routes for the UI"""

from fastapi import APIRouter

from app.routes.user_data import router as user_data_router

from .auth import router as auth_router
from .bibliography import router as bibliography_router
from .configuration import router as configuration_router
from .events import router as events_router
from .mocks import router as mocks_router
from .presentable import router as presentable_router
from .recommendation import router as recommendation_router
from .research_product import router as rp_router
from .search_filters import router as filters_router
from .search_results import router as results_router
from .search_suggestions import router as suggestions_router
from .user_actions import router as user_actions_router
from .user_recommendations import router as user_recommendations

web_api_router = APIRouter()
web_api_router.include_router(results_router)
web_api_router.include_router(suggestions_router)
web_api_router.include_router(filters_router)
web_api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
web_api_router.include_router(mocks_router, tags=["mocks"])
web_api_router.include_router(user_actions_router, tags=["user_actions"])
web_api_router.include_router(presentable_router)
web_api_router.include_router(recommendation_router, tags=["recommendations"])
web_api_router.include_router(configuration_router, tags=["configuration"])
web_api_router.include_router(suggestions_router)
web_api_router.include_router(rp_router)
web_api_router.include_router(bibliography_router)
web_api_router.include_router(
    user_recommendations, prefix="/evaluate", tags=["evaluate"]
)
web_api_router.include_router(events_router, prefix="/events", tags=["events"])
web_api_router.include_router(user_data_router, prefix="/user-data", tags=["user-data"])
