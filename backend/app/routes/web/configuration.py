# pylint: disable=missing-function-docstring
"""The UI application configuration endpoint"""

from fastapi import APIRouter

from app.schemas.configuration_response import ConfigurationResponse
from app.settings import settings

router = APIRouter()


@router.get("/config", name="web:configuration", response_model=ConfigurationResponse)
async def config():
    return ConfigurationResponse(
        eu_marketplace_url=settings.EU_MARKETPLACE_BASE_URL,
        pl_marketplace_url=settings.PL_MARKETPLACE_BASE_URL,
        eosc_explore_url=settings.EOSC_EXPLORE_URL,
        eosc_commons_url=settings.EOSC_COMMONS_URL,
        eosc_commons_env=settings.EOSC_COMMONS_ENV,
        knowledge_hub_url=settings.KNOWLEDGE_HUB_URL,
        is_sort_by_relevance=settings.IS_SORT_BY_RELEVANCE,
        max_results_by_page=settings.MAX_RESULTS_BY_PAGE,
        max_items_sort_relevance=settings.MAX_ITEMS_SORT_RELEVANCE,
        show_beta_collections=settings.SHOW_BETA_COLLECTIONS,
    )
