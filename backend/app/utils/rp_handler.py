# pylint: disable=use-dict-literal
"""
Module responsible for OIDC auth calls.
Create one instance of Relaying Party Handler service instance,
which contain inner tokens session.

For more information's see:
https://oidcrp.readthedocs.io/en/latest/rp_handler.html
"""

import json
import tempfile
import urllib.request
from urllib.error import HTTPError
from urllib.parse import urlparse

from cachetools import TTLCache, cached
from cryptojwt.key_jar import KeyJar, init_key_jar
from oidcrp.rp_handler import RPHandler

from app.settings import OIDC_CONFIG, OIDC_JWT_ENCRYPT_CONFIG

cache = TTLCache(maxsize=1, ttl=64800)  # 24h


@cached(cache)
def _fetch_jwks(url_to_open):
    try:
        with urllib.request.urlopen(url_to_open) as url:
            public_key_jwks = json.loads(url.read().decode())
            return json.dumps(public_key_jwks, indent=2).encode("utf-8")
    except HTTPError:
        return None


def _get_key_jar(config):
    if not config:
        return KeyJar()

    parsed_public_path = urlparse(config["public_path"])
    is_public_key_file = not parsed_public_path.scheme
    if is_public_key_file:
        key_jar = init_key_jar(**config)
        return key_jar

    with tempfile.NamedTemporaryFile(suffix=".json") as temp:
        jwks = _fetch_jwks(config["public_path"])
        if not jwks:
            return KeyJar()

        temp.write(jwks)
        temp.seek(0)
        new_config = dict(
            public_path=temp.name,
            key_defs=config["key_defs"],
            issuer_id=config["issuer_id"],
            read_only=config["read_only"],
        )
        key_jar = init_key_jar(**new_config)

    return key_jar


rp_handler = RPHandler(
    base_url=OIDC_CONFIG["base_url"],
    client_configs=OIDC_CONFIG["clients"],
    services=OIDC_CONFIG["services"],
    keyjar=_get_key_jar(OIDC_JWT_ENCRYPT_CONFIG),
    httpc_params=OIDC_CONFIG["httpc_params"],
)
