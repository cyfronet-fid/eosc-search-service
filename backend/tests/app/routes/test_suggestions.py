# pylint: disable=missing-module-docstring,missing-function-docstring,unused-argument
from unittest.mock import ANY, AsyncMock

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette import status

SEARCH_SUGGESTION_PATH = "/api/web/search-suggestions"


@pytest.mark.asyncio
async def test_suggestion_empty(
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
            "scope": "",
        },
        json={},
    )
    assert res.status_code == status.HTTP_200_OK
    mock_post_search.assert_called_once_with(
        ANY,
        "publication",
        q="bar",
        qf="bar baz",
        fq=[],
        sort=["score desc", "id asc"],
        rows=3,
        exact="false",
        scope="",
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
    assert mock_post_search.call_count == 9


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
