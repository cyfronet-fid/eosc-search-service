# pylint: disable=missing-module-docstring,missing-class-docstring
from typing import Optional

from pydantic import BaseModel

from app.settings import Url


class ConfigurationResponse(BaseModel):
    marketplace_url: Url
    eosc_commons_url: Url
    eosc_commons_env: str
    eosc_explore_url: Url
    knowledge_hub_url: Url
    is_sort_by_relevance: bool
    max_results_by_page: int
    max_items_sort_relevance: int
    show_beta_collections: bool
    show_knowledge_base: bool
    user_documentation_url: Url
    related_services_endpoint: Url
    # Both are None unless Matomo is enabled
    matomo_url: Optional[Url] = None
    matomo_site_id: Optional[int] = None
