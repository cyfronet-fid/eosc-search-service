# pylint: disable=missing-module-docstring,missing-function-docstring,unused-argument
from unittest.mock import ANY, AsyncMock

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette import status

from app.settings import settings

SEARCH_SUGGESTION_PATH = "/api/web/search-suggestions"
ALL_COLLECTIONS = (
    "publication",
    "dataset",
    "software",
    "service",
    "data_source",
    "training",
    "guideline",
    "bundle",
)


@pytest.mark.asyncio
async def test_post_empty(
    app: FastAPI, client: AsyncClient, mock_post_search: AsyncMock
) -> None:
    res = await client.post(SEARCH_SUGGESTION_PATH, json={})

    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    mock_post_search.assert_not_called()


@pytest.mark.asyncio
async def test_suggestions_one_collection(
    app: FastAPI, client: AsyncClient, mock_post_search: AsyncMock
) -> None:
    res = await client.post(
        SEARCH_SUGGESTION_PATH,
        params={
            "q": "bar",
            "collection": "publication",
            "qf": "bar baz",
            "exact": "false",
        },
        json={},
    )
    assert res.status_code == status.HTTP_200_OK
    mock_post_search.assert_called_once_with(
        ANY,
        collection=f"{settings.NG_COLLECTIONS_PREFIX}publication",
        q="bar",
        qf="bar baz",
        fq=[],
        sort=["score desc", "id asc"],
        rows=3,
    )


@pytest.mark.asyncio
async def test_suggestions_dispatch_collections(
    app: FastAPI, client: AsyncClient, mock_post_search: AsyncMock
) -> None:
    res = await client.post(
        SEARCH_SUGGESTION_PATH,
        params={
            "q": "bar",
            "collection": "all_collection",
            "qf": "bar baz",
            "exact": "false",
        },
        json={},
    )
    assert res.status_code == status.HTTP_200_OK
    assert mock_post_search.call_count == 10


@pytest.mark.parametrize(
    "results_per_collection, http_status",
    [
        ("3", status.HTTP_200_OK),
        ("9", status.HTTP_200_OK),
        ("10", status.HTTP_422_UNPROCESSABLE_ENTITY),
    ],
)
@pytest.mark.asyncio
async def test_rows_limit(
    results_per_collection: int,
    http_status: status,
    app: FastAPI,
    client: AsyncClient,
    mock_post_search: AsyncMock,
):
    res = await client.post(
        SEARCH_SUGGESTION_PATH,
        params={
            "q": "bar",
            "collection": "publication",
            "qf": "bar baz",
            "exact": "false",
            "results_per_collection": results_per_collection,
        },
        json={},
    )
    assert res.status_code == http_status
