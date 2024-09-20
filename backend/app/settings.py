# pylint: disable=invalid-name, use-dict-literal, fixme
"""Backend Settings"""
import logging
from typing import Annotated, Literal, Optional
from urllib.parse import urljoin, urlparse

from pydantic import BeforeValidator, HttpUrl, PostgresDsn, TypeAdapter
from pydantic_settings import BaseSettings, SettingsConfigDict

# In pydantic v2 http annotations are not strings themselves which may cause code to crash.
# Therefore, let's annotate it as str and validate http "manually"
Url = Annotated[
    str, BeforeValidator(lambda value: str(TypeAdapter(HttpUrl).validate_python(value)))
]
EnvironmentType = Literal["dev", "test", "production"]


class GlobalSettings(BaseSettings):
    """Common settings that are used among all environments"""

    # General
    ENVIRONMENT: EnvironmentType = "production"
    LOG_LEVEL: str = logging.getLevelName(logging.INFO)
    IS_TESTING: bool = False

    # Operational
    BACKEND_BASE_URL: Url = "http://localhost:8000/"
    UI_BASE_URL: Url = "http://localhost:4200/"
    DATABASE_URI: PostgresDsn = "postgresql+psycopg2://ess:ess@localhost:5442/ess"
    MAX_RESULTS_BY_PAGE: int = 50
    SHOW_BETA_COLLECTIONS: bool = False

    # Services
    # - Solr
    SOLR_URL: Url = "http://localhost:8983/solr/"
    COLLECTIONS_PREFIX: str = ""

    # - Recommender System
    RS_URL: Url = "http://localhost:9080/"
    RECOMMENDER_ENDPOINT: Url = (  # Remove / from the end!
        "http://localhost:8081/recommendations"
    )
    RS_ROWS: int = 1000  # TODO deprecated?
    SHOW_RECOMMENDATIONS: bool = True
    SHOW_RANDOM_RECOMMENDATIONS: bool = True
    IS_SORT_BY_RELEVANCE: bool = True
    MAX_ITEMS_SORT_RELEVANCE: int = 250

    # - STOMP
    STOMP_HOST: str = "127.0.0.1"
    STOMP_PORT: int = 61613
    STOMP_LOGIN: str = "guest"
    STOMP_PASS: str = "guest"
    STOMP_USER_ACTIONS_TOPIC: str = "/topic/user_actions"
    STOMP_CLIENT_NAME: str = "dev-client"
    STOMP_SSL: bool = False

    # - OIDC
    OIDC_HOST: Url = "https://aai-demo.eosc-portal.eu"
    OIDC_CLIENT_ID: str = "NO_CLIENT_ID"
    OIDC_CLIENT_SECRET: str = "NO_CLIENT_SECRET"
    OIDC_AAI_NEW_API: bool = False
    # Old OIDC API by default
    OIDC_ISSUER: Url = urljoin(OIDC_HOST, "/oidc/")
    OIDC_AUTH_ENDPOINT: str = "/oidc/authorize"
    OIDC_TOKEN_ENDPOINT: str = "/oidc/token"
    OIDC_USERINFO_ENDPOINT: str = "/oidc/userinfo"
    OIDC_JWKS_ENDPOINT: str = "/oidc/jwk"

    # - Sentry
    SENTRY_DSN: Optional[str] = None

    # - Other
    RELATED_SERVICES_ENDPOINT: Url = (
        "https://integration.providers.sandbox.eosc-beyond.eu/"
        + "api/public/interoperabilityRecord/relatedResources"
    )

    # Redirections
    EU_MARKETPLACE_BASE_URL: Url = "https://marketplace.sandbox.eosc-beyond.eu/"
    PL_MARKETPLACE_BASE_URL: Url = "https://marketplace.eosc.pl/"
    EOSC_COMMONS_URL: Url = (  # Without / at the end it doesn't work
        "https://s3.cloud.cyfronet.pl/eosc-portal-common/"
    )
    EOSC_COMMONS_ENV: str = "production"
    EOSC_EXPLORE_URL: Url = "https://explore.eosc-portal.eu/"
    KNOWLEDGE_HUB_URL: Url = "https://knowledge-hub.eosc-portal.eu/"

    # Get config from .env
    model_config = SettingsConfigDict(env_file="../.env", env_file_encoding="utf-8")


class DevSettings(GlobalSettings):
    """Dev Settings"""


class TestSettings(GlobalSettings):
    """Test Settings"""

    IS_TESTING: bool = True
    DATABASE_URI: PostgresDsn = (
        "postgresql+psycopg2://ess_test:ess_test@localhost:5452/ess_test"
    )
    SOLR_URL: Url = "http://localhost:8993/solr/"
    COLLECTIONS_PREFIX: str = "test_"
    model_config = SettingsConfigDict(env_prefix="TEST_")


class ProductionSettings(GlobalSettings):
    """Production Settings"""


class EnvironmentConfig(GlobalSettings):
    """Get settings based on your environment"""

    TYPES_TO_SETTINGS_MAP: dict = {
        "production": ProductionSettings,
        "dev": DevSettings,
        "test": TestSettings,
    }

    def make_settings(self) -> GlobalSettings:
        """Make and return final settings"""
        s = self.TYPES_TO_SETTINGS_MAP[self.ENVIRONMENT]()
        if s.OIDC_AAI_NEW_API:  # Adjust OIDC integration params for the new API
            s.OIDC_ISSUER = urljoin(s.OIDC_HOST, "/auth/realms/core")
            s.OIDC_JWKS_ENDPOINT = "/auth/realms/core/protocol/openid-connect/certs"
            s.OIDC_USERINFO_ENDPOINT = (
                "/auth/realms/core/protocol/openid-connect/userinfo"
            )
            s.OIDC_TOKEN_ENDPOINT = "/auth/realms/core/protocol/openid-connect/token"
            s.OIDC_AUTH_ENDPOINT = "/auth/realms/core/protocol/openid-connect/auth"

        return s


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
        authorization_endpoint=urljoin(settings.OIDC_HOST, settings.OIDC_AUTH_ENDPOINT),
        token_endpoint=urljoin(settings.OIDC_HOST, settings.OIDC_TOKEN_ENDPOINT),
        userinfo_endpoint=urljoin(settings.OIDC_HOST, settings.OIDC_USERINFO_ENDPOINT),
    ),
    redirect_uris=[urljoin(settings.BACKEND_BASE_URL, "/api/web/auth/checkin")],
    post_logout_redirect_uri=urljoin(settings.BACKEND_BASE_URL, "/auth/logout"),
    backchannel_logout_uri=urljoin(settings.BACKEND_BASE_URL, "/auth/logout"),
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
    public_path=urljoin(settings.OIDC_HOST, settings.OIDC_JWKS_ENDPOINT),
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
