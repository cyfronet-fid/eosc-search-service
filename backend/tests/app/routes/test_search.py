# pylint: disable=missing-module-docstring,missing-function-docstring,redefined-outer-name
import json
import os
from unittest.mock import ANY, AsyncMock, Mock, create_autospec

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette.status import HTTP_200_OK, HTTP_422_UNPROCESSABLE_ENTITY

from app.schemas.search_request import TermsFacet
from app.solr.operations import search, search_dep


@pytest.mark.asyncio
async def test_post_empty(
    app: FastAPI, client: AsyncClient, mock_post_search: AsyncMock
) -> None:
    res = await client.post(app.url_path_for("apis:post-search"), json={})

    assert res.status_code == HTTP_422_UNPROCESSABLE_ENTITY
    mock_post_search.assert_not_called()


@pytest.mark.asyncio
async def test_post(
    app: FastAPI, client: AsyncClient, mock_post_search: AsyncMock
) -> None:
    res = await client.post(
        app.url_path_for("apis:post-search"),
        params={"q": "bar", "collection": "foo"},
        json={},
    )

    assert res.status_code == HTTP_200_OK
    mock_post_search.assert_called_once_with(
        ANY,
        "foo",
        q="bar",
        qf=[],
        fq=[],
        sort=["score desc", "id asc"],
        rows=10,
        cursor="*",
        facets=None,
    )


@pytest.mark.asyncio
async def test_passes_all_query_params(
    app: FastAPI, client: AsyncClient, mock_post_search: AsyncMock
) -> None:
    res = await client.post(
        app.url_path_for("apis:post-search"),
        params={
            "q": "bar",
            "collection": "foo",
            "qf": ["bar", "baz"],
            "fq": ['foo:"bar"'],
            "sort": ["fizz asc"],
            "rows": 42,
            "cursor": "transparent",
        },
        json={},
    )

    assert res.status_code == HTTP_200_OK
    mock_post_search.assert_called_once_with(
        ANY,
        "foo",
        q="bar",
        qf=["bar", "baz"],
        fq=['foo:"bar"'],
        sort=["fizz asc", "score desc", "id asc"],
        rows=42,
        cursor="transparent",
        facets=None,
    )


@pytest.mark.asyncio
async def test_passes_all_facets(
    app: FastAPI, client: AsyncClient, mock_post_search: AsyncMock
) -> None:
    res = await client.post(
        app.url_path_for("apis:post-search"),
        params={
            "q": "bar",
            "collection": "foo",
        },
        json={
            "facets": {
                "faz": {
                    "type": "terms",
                    "field": "baz",
                    "offset": 42,
                    "limit": 10,
                    "sort": "name desc",
                    "mincount": 5,
                    "missing": False,
                }
            }
        },
    )

    assert res.status_code == HTTP_200_OK
    mock_post_search.assert_called_once_with(
        ANY,
        "foo",
        q="bar",
        qf=[],
        fq=[],
        sort=["score desc", "id asc"],
        rows=10,
        cursor="*",
        facets={
            "faz": TermsFacet(
                type="terms",
                field="baz",
                offset=42,
                limit=10,
                sort="name desc",
                mincount=5,
                missing=False,
            )
        },
    )


@pytest.fixture
def mock_post_search(app: FastAPI) -> AsyncMock:
    mock_search = get_mock("test_search.post.response.json")

    app.dependency_overrides[search_dep] = lambda: mock_search
    yield mock_search
    del app.dependency_overrides[search_dep]


@pytest.fixture
async def client(app: FastAPI) -> AsyncClient:
    """Get lifecycle-managed AsyncClient"""
    async with AsyncClient(
        app=app,
        base_url="http://testserver",
        headers={"Content-Type": "application/json"},
    ) as client:
        yield client


def get_mock(file: str) -> AsyncMock:
    mock_json = json.loads(read_file_contents(file))
    mock_return = Mock()
    mock_return.is_error = False
    mock_return.json = Mock(return_value=mock_json)
    return create_autospec(search, return_value=mock_return)


def read_file_contents(file: str):
    with open(f"{os.path.dirname(__file__)}/{file}", "r", encoding="utf-8") as f:
        return f.read()
