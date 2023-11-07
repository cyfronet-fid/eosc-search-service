# pylint: disable=missing-module-docstring,missing-function-docstring,unused-argument,too-many-arguments
from unittest.mock import AsyncMock

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from starlette import status

from app.schemas.research_product_response import ResearchProductResponse

RESEARCH_PRODUCT_PATH = "api/web/research-product/{type}/{rp_id}"


@pytest.mark.asyncio
async def test_get_rp_by_id_success(
    app: FastAPI, client: AsyncClient, mock_solr_get: AsyncMock
) -> None:
    links = [
        "https://dx.doi.org/10.5281/zenodo.5491553",
        "http://dx.doi.org/10.5281/zenodo.5491554",
    ]

    url = RESEARCH_PRODUCT_PATH.format(
        type="publication", rp_id="50|dedup_wf_001::553fcef019776e6a6081c436faf76c3b"
    )
    response = await client.get(url=url)
    expected_result = ResearchProductResponse(
        title="CO2 en afvalbeleid. Resultaten monitoring 1991/1992  en knelpunten",
        links=links,
        author=["Oh KMM", "Joosten JM", "Martens WG"],
        type="publication",
        best_access_right="Open access",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == expected_result.dict()


@pytest.mark.parametrize(
    "collection, http_status",
    [
        ("publication", status.HTTP_200_OK),
        ("dataset", status.HTTP_200_OK),
        ("software", status.HTTP_200_OK),
        ("other_rp", status.HTTP_200_OK),
        # Restore after prefixes have been sorted out
        # ("service", status.HTTP_422_UNPROCESSABLE_ENTITY),
        # ("data_source", status.HTTP_422_UNPROCESSABLE_ENTITY),
        # ("training", status.HTTP_422_UNPROCESSABLE_ENTITY),
        # ("guideline", status.HTTP_422_UNPROCESSABLE_ENTITY),
        # ("bundle", status.HTTP_422_UNPROCESSABLE_ENTITY),
    ],
)
async def test_get_rp_by_id_accepts_only_valid_types(
    collection: str,
    http_status: status,
    app: FastAPI,
    client: AsyncClient,
    mock_solr_get: AsyncMock,
    mocker,
) -> None:
    url = RESEARCH_PRODUCT_PATH.format(
        type=collection, rp_id="50|dedup_wf_001::553fcef019776e6a6081c436faf76c3b"
    )
    response = await client.get(url=url)
    assert response.status_code == http_status
