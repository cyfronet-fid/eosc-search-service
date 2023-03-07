"""
    IMPORTANT!!! We're using environment variables served from system instead of
    keeping them in file due security risks.

    Configuration of the app based on
    https://www.starlette.io/config/
"""
import logging
import os
from urllib.parse import urlparse

from starlette.config import Config

config = Config(environ=os.environ)
IS_TESTING = config("TESTING", cast=bool, default=False)
LOG_LEVEL = config("LOG_LEVEL", cast=str, default=logging.getLevelName(logging.INFO))

DATABASE_URI = config(
    "DATABASE_URI",
    cast=str,
    default=(
        "postgresql+psycopg2://ess_test:ess_test@localhost:5452/ess_test"
        if IS_TESTING
        else "postgresql+psycopg2://ess:ess@localhost:5442/ess"
    ),
)

SOLR_URL = config("SOLR_URL", cast=str, default="http://localhost:8983/solr/")

RS_URL = config("RS_URL", cast=str, default="http://localhost:9080/")
RS_ROWS = config("RS_ROWS", cast=int, default="1000")

BACKEND_BASE_URL = config("BACKEND_BASE_URL", cast=str, default="http://localhost:8000")
UI_BASE_URL = config("UI_BASE_URL", cast=str, default="http://localhost:4200")

OIDC_HOST = config("OIDC_HOST", cast=str, default="https://aai-demo.eosc-portal.eu")
OIDC_AAI_NEW_API = config("OIDC_AAI_NEW_API", cast=bool, default=False)
OIDC_ISSUER = config(
    "OIDC_ISSUER",
    cast=str,
    default=f"{OIDC_HOST}{'/auth/realms/core' if OIDC_AAI_NEW_API else '/oidc/'}",
)
OIDC_CLIENT_ID = config("OIDC_CLIENT_ID", cast=str, default="NO_CLIENT_ID")
OIDC_CLIENT_SECRET = config("OIDC_CLIENT_SECRET", cast=str, default="NO_CLIENT_SECRET")

SHOW_RECOMMENDATIONS = config("SHOW_RECOMMENDATIONS", cast=bool, default=True)
STOMP_HOST = config("STOMP_HOST", cast=str, default="127.0.0.1")
STOMP_PORT = config("STOMP_PORT", cast=int, default="61613")
STOMP_LOGIN = config("STOMP_LOGIN", cast=str, default="guest")
STOMP_PASS = config("STOMP_PASS", cast=str, default="guest")
STOMP_USER_ACTIONS_TOPIC = config(
    "ESS_STOMP_USER_ACTION", cast=str, default="/topic/user_actions"
)
STOMP_CLIENT_NAME = config("ESS_QUEUE_CLIENT_NAME", cast=str, default="dev-client")
STOMP_SSL = config("ESS_STOMP_SSL", cast=bool, default=False)

OIDC_NEW_AUTH_ENDPOINT = "/auth/realms/core/protocol/openid-connect/auth"
OIDC_OLD_AUTH_ENDPOINT = "/oidc/authorize"
OIDC_AUTH_ENDPOINT = OIDC_OLD_AUTH_ENDPOINT
if OIDC_AAI_NEW_API:
    OIDC_AUTH_ENDPOINT = OIDC_NEW_AUTH_ENDPOINT

OIDC_NEW_TOKEN_ENDPOINT = "/auth/realms/core/protocol/openid-connect/token"
OIDC_OLD_TOKEN_ENDPOINT = "/oidc/token"
OIDC_TOKEN_ENDPOINT = OIDC_OLD_TOKEN_ENDPOINT
if OIDC_AAI_NEW_API:
    OIDC_TOKEN_ENDPOINT = OIDC_NEW_TOKEN_ENDPOINT

OIDC_NEW_USERINFO_ENDPOINT = "/auth/realms/core/protocol/openid-connect/userinfo"
OIDC_OLD_USERINFO_ENDPOINT = "/oidc/userinfo"
OIDC_USERINFO_ENDPOINT = OIDC_OLD_USERINFO_ENDPOINT
if OIDC_AAI_NEW_API:
    OIDC_USERINFO_ENDPOINT = OIDC_NEW_USERINFO_ENDPOINT


OIDC_CLIENT_OPTIONS = client_options = dict(
    issuer=OIDC_ISSUER,
    client_id=OIDC_CLIENT_ID,
    client_secret=OIDC_CLIENT_SECRET,
    behaviour=dict(
        application_name="user_profile_service",
        application_type="web",
        response_types=["code"],
        scope=["openid", "profile", "email"],
        token_endpoint_auth_method=["client_secret_basic", "client_secret_post"],
    ),
    provider_info=dict(
        authorization_endpoint=f"{OIDC_HOST}{OIDC_AUTH_ENDPOINT}",
        token_endpoint=f"{OIDC_HOST}{OIDC_TOKEN_ENDPOINT}",
        userinfo_endpoint=f"{OIDC_HOST}{OIDC_USERINFO_ENDPOINT}",
    ),
    redirect_uris=[f"{BACKEND_BASE_URL}/api/web/auth/checkin"],
    post_logout_redirect_uri=f"{BACKEND_BASE_URL}/auth/logout",
    backchannel_logout_uri=f"{BACKEND_BASE_URL}/auth/logout",
    backchannel_logout_session_required=True,
)

parsed_url = urlparse(BACKEND_BASE_URL)
OIDC_CONFIG = dict(
    port=parsed_url.port if parsed_url.port else None,
    domain=f"{parsed_url.scheme}://{parsed_url.netloc}",
    base_url=f"{parsed_url.scheme}://{parsed_url.netloc}",
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

OIDC_NEW_JWKS_ENDPOINT = "/auth/realms/core/protocol/openid-connect/certs"
OIDC_OLD_JWKS_ENDPOINT = "/oidc/jwk"
OIDC_JWKS_ENDPOINT = OIDC_OLD_JWKS_ENDPOINT
if OIDC_AAI_NEW_API:
    OIDC_JWKS_ENDPOINT = OIDC_NEW_JWKS_ENDPOINT

OIDC_JWT_ENCRYPT_CONFIG = dict(
    public_path=f"{OIDC_HOST}{OIDC_JWKS_ENDPOINT}",
    key_defs=[
        {"type": "RSA", "use": ["sig"]},
    ],
    issuer_id=OIDC_ISSUER,
    read_only=True,
)
OIDC_CONFIG["clients"] = {}
OIDC_CONFIG["clients"][OIDC_ISSUER] = OIDC_CLIENT_OPTIONS

parsed_url = urlparse(UI_BASE_URL)
AUTH_COOKIES_CONFIG = dict(
    domain=parsed_url.hostname,
    max_age=24 * 60 * 60,  # 1 day
    cookie_name="_mp_service_auth",
    identifier="general_verifier",
    auto_error=True,
    secure=True,
    secret_key="DONOTUSE",
)

RECOMMENDER_ENDPOINT = config(
    "RECOMMENDER_ENDPOINT", cast=str, default="http://localhost:8081/recommendations"
)

MARKETPLACE_BASE_URL = config(
    "MARKETPLACE_BASE_URL", cast=str, default="https://marketplace.eosc-portal.eu"
)

EOSC_COMMONS_URL = config(
    "EOSC_COMMONS_URL",
    cast=str,
    default="https://s3.cloud.cyfronet.pl/eosc-portal-common/",
)

EOSC_COMMONS_ENV = config("EOSC_COMMONS_ENV", cast=str, default="production")
