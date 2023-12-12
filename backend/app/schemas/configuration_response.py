# pylint: disable=missing-module-docstring,missing-class-docstring
from pydantic import AnyHttpUrl, BaseModel


class ConfigurationResponse(BaseModel):
    marketplace_url: AnyHttpUrl
    eosc_commons_url: AnyHttpUrl
    eosc_commons_env: str
    eosc_explore_url: AnyHttpUrl
    knowledge_hub_url: AnyHttpUrl
    is_sort_by_relevance: bool
    max_results_by_page: int
    max_items_sort_relevance: int
