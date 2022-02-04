"""
    IMPORTANT!!! We're using environment variables served from system instead of
    keeping them in file due security risks.

    Configuration of the app based on
    https://www.starlette.io/config/
"""

import os

from starlette.config import Config

config = Config(environ=os.environ)
IS_TESTING = config("TESTING", cast=bool, default=False)

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

UI_DOMAIN = config("UI_DOMAIN", cast=str, default="http://localhost:4200")
DOMAIN = config("DOMAIN", cast=str, default="localhost")
DOMAIN_PORT = config("DOMAIN_PORT", cast=int, default=8000)
HOST = config(
    "OIDC_HOST",
    cast=str,
    default=f'http://{DOMAIN}{f":{DOMAIN_PORT}" if DOMAIN_PORT else ""}',
)
OIDC_HOST = config("OIDC_HOST", cast=str, default="aai-demo.eosc-portal.eu")
OIDC_ISSUER = config("OIDC_ISSUER", cast=str, default=f"https://{OIDC_HOST}/oidc/")
OIDC_CLIENT_ID = config("OIDC_CLIENT_ID", cast=str, default="NO_CLIENT_ID")
OIDC_CLIENT_SECRET = config("OIDC_CLIENT_SECRET", cast=str, default="NO_CLIENT_SECRET")

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
        authorization_endpoint=f"https://{OIDC_HOST}/oidc/authorize",
        token_endpoint=f"https://{OIDC_HOST}/oidc/token",
        userinfo_endpoint=f"https://{OIDC_HOST}/oidc/userinfo",
    ),
    redirect_uris=[f"{HOST}/api/web/auth/checkin"],
    post_logout_redirect_uri=f"{HOST}/auth/logout",
    backchannel_logout_uri=f"{HOST}/auth/logout",
    backchannel_logout_session_required=True,
)
OIDC_CONFIG = dict(
    port=DOMAIN_PORT,
    domain=DOMAIN,
    base_url=HOST,
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
    public_path=f"https://{OIDC_HOST}/oidc/jwk",
    key_defs=[
        {"type": "RSA", "use": ["sig"]},
    ],
    issuer_id=OIDC_ISSUER,
    read_only=True,
)
OIDC_CONFIG["clients"] = {}
OIDC_CONFIG["clients"][OIDC_ISSUER] = OIDC_CLIENT_OPTIONS

AUTH_COOKIES_CONFIG = dict(
    max_age=24 * 60 * 60,  # 1 day
    cookie_name="_mp_service_auth",
    identifier="general_verifier",
    auto_error=True,
    secure=True,
    secret_key="DONOTUSE",
)
