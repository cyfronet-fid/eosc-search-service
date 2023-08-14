"""Common routes code"""

import httpx
from httpx import AsyncClient


def make_async_http_client() -> AsyncClient:
    """Return configured AsyncClient to be used across external API calls"""
    return AsyncClient(
        timeout=httpx.Timeout(15.0),
        limits=httpx.Limits(max_connections=10, max_keepalive_connections=10),
    )
