# pylint: disable=missing-module-docstring,missing-class-docstring
from pydantic import AnyHttpUrl, BaseModel


class ConfigurationResponse(BaseModel):
    marketplace_url: AnyHttpUrl
    eosc_commons_url: AnyHttpUrl
    eosc_commons_env: str
    eosc_explore_url: AnyHttpUrl
