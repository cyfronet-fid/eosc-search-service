# pylint: disable=missing-module-docstring,missing-function-docstring,redefined-outer-name
import os
import unittest.mock
from unittest.mock import ANY, AsyncMock

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette.status import (
    HTTP_200_OK,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY,
    HTTP_500_INTERNAL_SERVER_ERROR,
)

from app.schemas.search_request import StatFacet, TermsFacet
from app.settings import settings


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
        params={
            "q": "bar",
            "collection": "foo",
            "qf": "bar baz",
            "exact": "false",
        },
        json={},
    )

    assert res.status_code == HTTP_200_OK
    mock_post_search.assert_called_once_with(
        ANY,
        "foo",
        q="bar",
        qf="bar baz",
        exact="false",
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
            "qf": "bar baz",
            "exact": "false",
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
        qf="bar baz",
        exact="false",
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
            "qf": "bar baz",
            "exact": "false",
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
                },
                "max_bar": {"expression": "max(bar)"},
            }
        },
    )

    assert res.status_code == HTTP_200_OK
    mock_post_search.assert_called_once_with(
        ANY,
        "foo",
        q="bar",
        qf="bar baz",
        exact="false",
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
            ),
            "max_bar": StatFacet(expression="max(bar)"),
        },
    )


@pytest.mark.asyncio
@pytest.mark.integration
@pytest.mark.parametrize("collection", ["test_collection"])
# pylint: disable=unused-argument
async def test_integration(
    app: FastAPI, client: AsyncClient, index_solr_docs: None, collection: str
) -> None:
    res = await client.post(
        app.url_path_for("apis:post-search"),
        params={
            "q": "model",
            "collection": collection,
            "qf": "title description subject",
            "exact": "false",
        },
        json={
            "facets": {
                "sub": {
                    "type": "terms",
                    "field": "subject",
                    "limit": 5,
                }
            }
        },
    )

    assert res.status_code == HTTP_200_OK
    res_json = res.json()
    assert len(res_json["results"]) == 2
    assert (
        res_json["nextCursorMark"]
        == "AoIIP3lcOD8SNTB8MzU1ZTY1NjI1Yjg4OjowYTU1Yjg3ODA5MTljZTBkNWVhMGU2ZWYxZDhjMDI0MQ=="
    )
    assert len(res_json["facets"]["sub"]["buckets"]) == 5


@pytest.mark.asyncio
@pytest.mark.integration
async def test_integration_400(app: FastAPI, client: AsyncClient) -> None:
    res = await client.post(
        app.url_path_for("apis:post-search"),
        params={
            "q": "*",
            "collection": "test_collection",
            "qf": "title description subject",
            "exact": "false",
        },
        json={},
    )

    assert res.status_code == HTTP_404_NOT_FOUND
    assert res.json() == {"detail": "Not Found"}


@pytest.mark.asyncio
@pytest.mark.integration
@unittest.mock.patch("app.settings.settings.SOLR_URL", "http://localhost:8994/solr/")
async def test_integration_500(app: FastAPI, client: AsyncClient) -> None:
    res = await client.post(
        app.url_path_for("apis:post-search"),
        params={
            "q": "*",
            "collection": "test_collection",
            "qf": "title description subject",
            "exact": "false",
        },
        json={},
    )

    assert res.status_code == HTTP_500_INTERNAL_SERVER_ERROR
    assert res.json() == {"detail": "Try again later"}


@pytest.fixture
def setup_solr_collection(collection: str) -> None:
    config_name = "all_collection_16-06-2023"
    solr_url = settings.SOLR_URL.replace("/solr/", "")
    os.system(
        f"../solr/create-collection.sh --name {collection}"
        f" --config-name {config_name} --solr-url {solr_url}"
    )
    yield
    os.system(f"../solr/delete-collection.sh --name {collection} --solr-url {solr_url}")


@pytest.fixture
# pylint: disable=unused-argument
async def index_solr_docs(setup_solr_collection: None, collection: str) -> None:
    with open(f"{os.path.dirname(__file__)}/records.jsonl", "r", encoding="utf-8") as f:
        lines = f.readlines()
    request_body = f"[{','.join(lines)}]"
    async with AsyncClient() as client:
        await client.post(
            f"{settings.SOLR_URL}{collection}/update/json/docs?commit=true",
            content=request_body,
        )
