# pylint: disable=missing-module-docstring,missing-function-docstring
# pylint: disable=useless-suppression
from unittest.mock import ANY, AsyncMock

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette import status

from app.schemas.search_request import StatFacet, TermsFacet


@pytest.mark.asyncio
async def test_post_empty(
    app: FastAPI, client: AsyncClient, mock_post_search: AsyncMock
) -> None:
    res = await client.post(app.url_path_for("apis:post-search"), json={})

    assert res.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
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

    assert res.status_code == status.HTTP_200_OK
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

    assert res.status_code == status.HTTP_200_OK
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

    assert res.status_code == status.HTTP_200_OK
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
