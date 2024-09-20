# pylint: disable=missing-module-docstring,missing-class-docstring
from pydantic import BaseModel

from app.settings import Url


class ConfigurationResponse(BaseModel):
    eu_marketplace_url: Url
    pl_marketplace_url: Url
    eosc_commons_url: Url
    eosc_commons_env: str
    eosc_explore_url: Url
    knowledge_hub_url: Url
    is_sort_by_relevance: bool
    max_results_by_page: int
    max_items_sort_relevance: int
    show_beta_collections: bool
