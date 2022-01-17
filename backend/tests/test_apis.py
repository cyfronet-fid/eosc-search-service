# pylint: disable=missing-module-docstring,missing-function-docstring

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette.status import HTTP_404_NOT_FOUND, HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_search_get_empty(app: FastAPI, client: AsyncClient) -> None:
    res = await client.get(app.url_path_for("apis:get-search"))
    assert res.status_code == HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_search_get(app: FastAPI, client: AsyncClient) -> None:
    res = await client.get(
        app.url_path_for("apis:get-search"), params={"q": "sth", "collection": "foo"}
    )
    assert res.status_code == HTTP_404_NOT_FOUND
