# pylint: disable=use-dict-literal, line-too-long, missing-class-docstring, missing-function-docstring, no-self-argument too-few-public-methods
"""
    IMPORTANT!!! We're using environment variables served from system instead of
    keeping them in file due security risks.

    Configuration of the app based on
    https://docs.pydantic.dev/1.10/usage/settings/
"""
import logging
from typing import Literal
from urllib.parse import urlparse

from pydantic import AnyUrl, BaseSettings, Field, PostgresDsn, root_validator

OIDC_NEW_AUTH_ENDPOINT: str = "/auth/realms/core/protocol/openid-connect/auth"
OIDC_OLD_AUTH_ENDPOINT: str = "/oidc/authorize"
OIDC_NEW_TOKEN_ENDPOINT: str = "/auth/realms/core/protocol/openid-connect/token"
OIDC_OLD_TOKEN_ENDPOINT: str = "/oidc/token"
OIDC_NEW_USERINFO_ENDPOINT: str = "/auth/realms/core/protocol/openid-connect/userinfo"
OIDC_OLD_USERINFO_ENDPOINT: str = "/oidc/userinfo"
OIDC_NEW_JWKS_ENDPOINT: str = "/auth/realms/core/protocol/openid-connect/certs"
OIDC_OLD_JWKS_ENDPOINT: str = "/oidc/jwk"


EnvironmentType = Literal["dev", "test", "production"]


class GlobalSettings(BaseSettings):
    LOG_LEVEL: str = logging.getLevelName(logging.INFO)
    IS_TESTING: bool = False
    DATABASE_URI: PostgresDsn = "postgresql+psycopg2://ess:ess@localhost:5442/ess"
    SOLR_URL: AnyUrl = "http://localhost:8983/solr/"
    RS_URL: AnyUrl = "http://localhost:9080/"
    RS_ROWS: int = 1000
    BACKEND_BASE_URL: AnyUrl = "http://localhost:8000"
    UI_BASE_URL: AnyUrl = "http://localhost:4200"
    OIDC_HOST: AnyUrl = "https://aai-demo.eosc-portal.eu"
    OIDC_AAI_NEW_API: bool = False
    OIDC_CLIENT_ID: str = "NO_CLIENT_ID"
    OIDC_CLIENT_SECRET: str = "NO_CLIENT_SECRET"

    OIDC_ISSUER: str = f"{OIDC_HOST}/oidc/"
    OIDC_AUTH_ENDPOINT: str = OIDC_OLD_AUTH_ENDPOINT
    OIDC_TOKEN_ENDPOINT: str = OIDC_OLD_TOKEN_ENDPOINT
    OIDC_USERINFO_ENDPOINT: str = OIDC_OLD_USERINFO_ENDPOINT
    OIDC_JWKS_ENDPOINT = OIDC_OLD_JWKS_ENDPOINT

    STOMP_HOST: str = "127.0.0.1"
    STOMP_PORT: int = 61613
    STOMP_LOGIN: str = "guest"
    STOMP_PASS: str = "guest"
    STOMP_USER_ACTIONS_TOPIC = Field("/topic/user_actions", env="ESS_STOMP_USER_ACTION")
    STOMP_CLIENT_NAME = Field("dev-client", env="ESS_QUEUE_CLIENT_NAME")
    STOMP_SSL: bool = Field(False, env="ESS_STOMP_SSL")

    SHOW_RECOMMENDATIONS: bool = True
    SHOW_RANDOM_RECOMMENDATIONS: bool = True
    RECOMMENDER_ENDPOINT: AnyUrl = "http://localhost:8081/recommendations"
    MARKETPLACE_BASE_URL: AnyUrl = "https://marketplace.eosc-portal.eu"
    EOSC_COMMONS_URL: AnyUrl = "https://s3.cloud.cyfronet.pl/eosc-portal-common/"
    EOSC_COMMONS_ENV: str = "production"
    EOSC_EXPLORE_URL: AnyUrl = "https://explore.eosc-portal.eu"
    KNOWLEDGE_HUB_URL: AnyUrl = "https://knowledge-hub.eosc-portal.eu/"
    RELATED_SERVICES_ENDPOINT: AnyUrl = "https://beta.providers.eosc-portal.eu/api/public/interoperabilityRecord/relatedResources"
    IS_SORT_BY_RELEVANCE: bool = True
    MAX_RESULTS_BY_PAGE: int = 50
    MAX_ITEMS_SORT_RELEVANCE: int = 250
    SHOW_BETA_COLLECTIONS: bool = True

    COLLECTIONS_PREFIX: str = ""

    @root_validator()
    def oidc_issuer_path(cls, values):
        if values["OIDC_AAI_NEW_API"]:
            values["OIDC_ISSUER"] = f"{values['OIDC_HOST']}/auth/realms/core"
            values["OIDC_JWKS_ENDPOINT"] = OIDC_NEW_JWKS_ENDPOINT
            values["OIDC_USERINFO_ENDPOINT"] = OIDC_NEW_USERINFO_ENDPOINT
            values["OIDC_TOKEN_ENDPOINT"] = OIDC_NEW_TOKEN_ENDPOINT
            values["OIDC_AUTH_ENDPOINT"] = OIDC_NEW_AUTH_ENDPOINT
        return values


class DevSettings(GlobalSettings):
    pass


class TestSettings(GlobalSettings):
    IS_TESTING: bool = True
    DATABASE_URI: PostgresDsn = (
        "postgresql+psycopg2://ess_test:ess_test@localhost:5452/ess_test"
    )
    SOLR_URL: AnyUrl = "http://localhost:8993/solr/"
    COLLECTIONS_PREFIX = "test_"

    class Config:
        env_prefix = "TEST_"


class ProductionSettings(GlobalSettings):
    pass


class EnvironmentConfig(BaseSettings):
    ENVIRONMENT: EnvironmentType = "production"

    TYPES_TO_SETTINGS_MAP = {
        "production": ProductionSettings,
        "dev": DevSettings,
        "test": TestSettings,
    }

    def make_settings(self) -> GlobalSettings:
        return self.TYPES_TO_SETTINGS_MAP[self.ENVIRONMENT]()


settings = EnvironmentConfig().make_settings()


parsed_backend_url = urlparse(settings.BACKEND_BASE_URL)
parsed_ui_url = urlparse(settings.UI_BASE_URL)

OIDC_CLIENT_OPTIONS = client_options = dict(
    issuer=settings.OIDC_ISSUER,
    client_id=settings.OIDC_CLIENT_ID,
    client_secret=settings.OIDC_CLIENT_SECRET,
    behaviour=dict(
        application_name="user_profile_service",
        application_type="web",
        response_types=["code"],
        scope=["openid", "profile", "email"],
        token_endpoint_auth_method=["client_secret_basic", "client_secret_post"],
    ),
    provider_info=dict(
        authorization_endpoint=f"{settings.OIDC_HOST}{settings.OIDC_AUTH_ENDPOINT}",
        token_endpoint=f"{settings.OIDC_HOST}{settings.OIDC_TOKEN_ENDPOINT}",
        userinfo_endpoint=f"{settings.OIDC_HOST}{settings.OIDC_USERINFO_ENDPOINT}",
    ),
    redirect_uris=[f"{settings.BACKEND_BASE_URL}/api/web/auth/checkin"],
    post_logout_redirect_uri=f"{settings.BACKEND_BASE_URL}/auth/logout",
    backchannel_logout_uri=f"{settings.BACKEND_BASE_URL}/auth/logout",
    backchannel_logout_session_required=True,
)


OIDC_CONFIG = dict(
    port=parsed_backend_url.port if parsed_backend_url.port else None,
    domain=f"{parsed_backend_url.scheme}://{parsed_backend_url.netloc}",
    base_url=f"{parsed_backend_url.scheme}://{parsed_backend_url.netloc}",
    httpc_params=dict(verify=False),
    services=dict(
        discovery={
            "class": "oidcrp.oidc.provider_info_discovery.ProviderInfoDiscovery",
            "kwargs": {},
        },
        registration={"class": "oidcrp.oidc.registration.Registration", "kwargs": {}},
        authorization={
            "class": "oidcrp.oidc.authorization.Authorization",
            "kwargs": {},
        },
        accesstoken={"class": "oidcrp.oidc.access_token.AccessToken", "kwargs": {}},
        userinfo={"class": "oidcrp.oidc.userinfo.UserInfo", "kwargs": {}},
        end_session={"class": "oidcrp.oidc.end_session.EndSession", "kwargs": {}},
    ),
)


OIDC_JWT_ENCRYPT_CONFIG = dict(
    public_path=f"{settings.OIDC_HOST}{settings.OIDC_JWKS_ENDPOINT}",
    key_defs=[
        {"type": "RSA", "use": ["sig"]},
    ],
    issuer_id=settings.OIDC_ISSUER,
    read_only=True,
)
OIDC_CONFIG["clients"] = {}
OIDC_CONFIG["clients"][settings.OIDC_ISSUER] = OIDC_CLIENT_OPTIONS

AUTH_COOKIES_CONFIG = dict(
    domain=parsed_ui_url.hostname,
    max_age=24 * 60 * 60,  # 1 day
    cookie_name="_mp_service_auth",
    identifier="general_verifier",
    auto_error=True,
    secure=True,
    secret_key="DONOTUSE",
)
