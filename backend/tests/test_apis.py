# pylint: disable=missing-module-docstring,missing-function-docstring

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette.status import HTTP_404_NOT_FOUND, HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_search_post_empty(app: FastAPI, client: AsyncClient) -> None:
    res = await client.post(app.url_path_for("apis:post-search"), json={})
    assert res.status_code == HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_search_post(app: FastAPI, client: AsyncClient) -> None:
    res = await client.post(
        app.url_path_for("apis:post-search"),
        params={"q": "sth", "collection": "foo"},
        json={},
    )
    assert res.status_code == HTTP_404_NOT_FOUND
