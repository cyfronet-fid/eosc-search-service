# pylint: disable=missing-module-docstring,missing-function-docstring
import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette.status import HTTP_200_OK


@pytest.mark.asyncio
async def test_passes_all_facets(app: FastAPI, client: AsyncClient) -> None:
    response = await client.get(app.url_path_for("web:configuration"))

    assert response.status_code == HTTP_200_OK
    assert response.json() == {"marketplace_url": "https://marketplace.eosc-portal.eu"}
