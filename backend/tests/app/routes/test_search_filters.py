from unittest.mock import AsyncMock

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette import status

SEARCH_FILTERS_PATH = "/api/web/search-filters"


@pytest.mark.asyncio
async def test_post_empty(
    app: FastAPI, client: AsyncClient, mock_post_search_filters: AsyncMock
) -> None:
    res = await client.post(SEARCH_FILTERS_PATH, json={})

    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    mock_post_search_filters.assert_not_called()


@pytest.mark.asyncio
async def test_post_no_facets(
    app: FastAPI, client: AsyncClient, mock_post_search_filters: AsyncMock
) -> None:
    res = await client.post(
        SEARCH_FILTERS_PATH,
        params={
            "q": "bar",
            "qf": "bar baz",
            "fq": [],
            "rows": 3,
            "cursor": "*",
            "facets": None,
        },
    )

    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_search_filters_one_facet(
    app: FastAPI, client: AsyncClient, mock_post_search_filters: AsyncMock
) -> None:
    res = await client.post(
        SEARCH_FILTERS_PATH,
        params={
            "collection": "foo",
            "q": "bar",
            "qf": "bar baz",
            "fq": [],
            "rows": 3,
            "cursor": "*",
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
            }
        },
    )

    assert res.status_code == status.HTTP_200_OK
