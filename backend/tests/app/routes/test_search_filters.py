# pylint: disable=missing-module-docstring,missing-function-docstring
from unittest.mock import AsyncMock

import pytest
from httpx import AsyncClient
from starlette import status

SEARCH_FILTERS_PATH = "/api/web/search-filters"


@pytest.mark.asyncio
async def test_post_empty(
    client: AsyncClient, mock_post_search_filters: AsyncMock
) -> None:
    res = await client.post(SEARCH_FILTERS_PATH, json={})

    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    mock_post_search_filters.assert_not_called()


@pytest.mark.asyncio
async def test_post_no_facets(
    client: AsyncClient, mock_post_search_filters: AsyncMock
) -> None:
    res = await client.post(
        SEARCH_FILTERS_PATH,
        params={
            "q": "bar",
            "qf": "bar baz",
            "fq": [],
            "rows": 3,
            "cursor": "*",
            "scope": None,
            "facets": None,
        },
    )

    mock_post_search_filters.assert_not_called()

    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_search_filters_one_facet(
    client: AsyncClient, mock_post_search_filters: AsyncMock
) -> None:
    res = await client.post(
        SEARCH_FILTERS_PATH,
        params={
            "collection": "all_collection",
            "q": "bar",
            "qf": "bar baz",
            "fq": [],
            "exact": "false",
            "rows": 3,
            "cursor": "*",
            "scope": None,
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
    mock_post_search_filters.assert_called_once()
    assert res.status_code == status.HTTP_200_OK
