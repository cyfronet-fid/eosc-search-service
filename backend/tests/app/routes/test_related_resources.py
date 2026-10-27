# pylint: disable=missing-module-docstring,missing-function-docstring
from unittest.mock import ANY, AsyncMock

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette import status

from app.schemas.solr_response import Collection, RelatedService, SolrResponse
from app.solr.operations import search_dep


@pytest.mark.asyncio
async def test_get_guideline_related_services(
    app: FastAPI,
    client: AsyncClient,
    mocker,
) -> None:
    related_service = RelatedService(
        pid="service-1",
        best_access_right="open",
        title="Service one",
        resource_organisation="EOSC",
        type="service",
    )
    get_related_services = mocker.patch(
        "app.routes.web.related_resources.get_related_services_for_guidelines",
        new=AsyncMock(return_value={"guideline-1": [related_service]}),
    )

    response = await client.post(
        app.url_path_for("web:post-guideline-related-services"),
        json={"guideline_ids": ["guideline-1"]},
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "related_services": {
            "guideline-1": [related_service.dict()],
        }
    }
    get_related_services.assert_awaited_once_with(ANY, ["guideline-1"])


@pytest.mark.asyncio
async def test_get_guideline_related_services_requires_ids(
    app: FastAPI,
    client: AsyncClient,
    mocker,
) -> None:
    get_related_services = mocker.patch(
        "app.routes.web.related_resources.get_related_services_for_guidelines",
        new=AsyncMock(),
    )

    response = await client.post(
        app.url_path_for("web:post-guideline-related-services"), json={}
    )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    get_related_services.assert_not_awaited()


@pytest.mark.asyncio
async def test_guideline_search_does_not_load_related_services(
    app: FastAPI,
    client: AsyncClient,
    mocker,
) -> None:
    guideline = {
        "id": "guideline-1",
        "type": "guideline",
        "title": ["Guideline one"],
    }
    search = AsyncMock(
        return_value=SolrResponse(
            collection=Collection.GUIDELINE,
            data={
                "response": {"docs": [guideline], "numFound": 1},
                "nextCursorMark": "next",
            },
        )
    )
    app.dependency_overrides[search_dep] = lambda: search
    extend_related_services = mocker.patch(
        "app.routes.web.search_results.extend_ig_with_related_services",
        new=AsyncMock(),
        create=True,
    )

    try:
        response = await client.post(
            "/api/web/search-results",
            params={
                "collection": "guideline",
                "q": "*",
                "qf": "title",
                "exact": "false",
            },
            json={},
        )
    finally:
        del app.dependency_overrides[search_dep]

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["results"] == [guideline]
    extend_related_services.assert_not_awaited()


@pytest.mark.asyncio
async def test_guideline_detail_does_not_load_related_services(
    client: AsyncClient,
    mock_solr_get: AsyncMock,
    mocker,
) -> None:
    extend_related_services = mocker.patch(
        "app.routes.web.presentable.extend_ig_with_related_services",
        new=AsyncMock(),
        create=True,
    )

    response = await client.get("/api/web/guideline/guideline-1")

    assert response.status_code == status.HTTP_200_OK
    mock_solr_get.assert_awaited_once()
    extend_related_services.assert_not_awaited()
