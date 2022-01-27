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
from urllib.parse import urlparse

from cryptojwt.key_jar import KeyJar, init_key_jar
from oidcrp.rp_handler import RPHandler

from app.config import OIDC_CONFIG, OIDC_JWT_ENCRYPT_CONFIG


def _write_jwks_to(url_to_open, jwks_tempfile):
    with urllib.request.urlopen(url_to_open) as url:
        public_key_jwks = json.loads(url.read().decode())
        jwks = json.dumps(public_key_jwks, indent=2).encode("utf-8")
        jwks_tempfile.write(jwks)
        jwks_tempfile.seek(0)


def _get_key_jar(config):
    if not config:
        return KeyJar()

    parsed_public_path = urlparse(config["public_path"])
    is_public_key_file = not parsed_public_path.scheme
    if is_public_key_file:
        key_jar = init_key_jar(**config)
        return key_jar

    key_jar = KeyJar()
    with tempfile.NamedTemporaryFile(suffix=".json") as temp:
        _write_jwks_to(config["public_path"], temp)
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
