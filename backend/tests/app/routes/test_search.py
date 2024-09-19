# pylint: disable=missing-module-docstring,missing-function-docstring,useless-suppression,fixme
from unittest.mock import ANY, AsyncMock

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette.status import HTTP_200_OK, HTTP_422_UNPROCESSABLE_ENTITY

from app.schemas.search_request import StatFacet, TermsFacet


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
            "scope": "",
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
        scope="",
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
            # TODO no matter what u pass here, it will return None - investigate
            "scope": "",
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
        scope="",
    )


@pytest.mark.asyncio
async def test_col_prefix_none_when_not_passed(
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
        scope=None,
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
            "scope": "",
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
        scope="",
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


# Integration tests are to be amended after introducing new testing environment

#
# @pytest.mark.asyncio
# @pytest.mark.integration
# @pytest.mark.parametrize("collection", ["other_rp"])
# @pytest.mark.skip(reason="Solr security issues must be addressed")
# async def test_integration_success(
#     app: FastAPI, client: AsyncClient, index_solr_docs: None, collection: str
# ) -> None:
#     res = await client.post(
#         app.url_path_for("apis:post-search"),
#         params={
#             "q": "model",
#             "collection": collection,
#             "qf": "title description subject",
#         },
#         json={
#             "facets": {
#                 "sub": {
#                     "type": "terms",
#                     "field": "subject",
#                     "limit": 5,
#                 }
#             }
#         },
#     )
#     assert res.status_code == HTTP_200_OK
#     assert len(res.json()["results"]) == 2
#     assert (
#         res.json()["nextCursorMark"]
#         == "AoIIP3lcOD8SNTB8MzU1ZTY1NjI1Yjg4OjowYTU1Yjg3ODA5MTljZTBkNWVhMGU2ZWYxZDhjMDI0MQ=="
#     )
#     assert len(res.json()["facets"]["sub"]["buckets"]) == 5
#
#
# @pytest.mark.asyncio
# @pytest.mark.integration
# @pytest.mark.skip(reason="Solr security issues must be addressed")
# async def test_integration_400(app: FastAPI, client: AsyncClient) -> None:
#     res = await client.post(
#         app.url_path_for("apis:post-search"),
#         params={
#             "q": "*",
#             "collection": "test_collection",
#             "qf": "title description subject",
#         },
#         json={},
#     )
#     assert res.status_code == HTTP_404_NOT_FOUND
#     assert res.json() == {"detail": "Possible mismatch in collection name"}
#
#
# @pytest.mark.asyncio
# @pytest.mark.integration
# @pytest.mark.skip(reason="Solr security issues must be addressed")
# @unittest.mock.patch("app.settings.settings.SOLR_URL", "http://localhost:8994/solr/")
# async def test_integration_500(app: FastAPI, client: AsyncClient) -> None:
#     res = await client.post(
#         app.url_path_for("apis:post-search"),
#         params={
#             "q": "*",
#             "collection": "test_collection",
#             "qf": "title description subject",
#         },
#         json={},
#     )
#
#     assert res.status_code == HTTP_500_INTERNAL_SERVER_ERROR
#     assert res.json() == {"detail": "Try again later"}
#
#
# @pytest.fixture
# def setup_solr_collection(collection: str) -> None:
#     config_name = "all_collection_04-08-2023"
#     solr_url = settings.SOLR_URL.replace("/solr/", "")
#     collection = f"{settings.COLLECTIONS_PREFIX}{collection}"
#     os.system(
#         f"../solr/create-collection.sh --name {collection}"
#         f" --config-name {config_name} --solr-url {solr_url}"
#     )
#     yield
#     os.system(f"../solr/delete-collection.sh --name {collection} --solr-url {solr_url}")
#
#
# @pytest.fixture
# async def index_solr_docs(setup_solr_collection: None, collection: str) -> None:
#     with open(f"{os.path.dirname(__file__)}/records.jsonl", "r", encoding="utf-8") as f:
#         lines = f.readlines()
#     request_body = f"[{','.join(lines)}]"
#     collection = f"{settings.COLLECTIONS_PREFIX}{collection}"
#     async with AsyncClient() as client:
#         await client.post(
#             f"{settings.SOLR_URL}{collection}/update/json/docs?commit=true",
#             content=request_body,
#         )
