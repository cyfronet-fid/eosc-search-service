# pylint: disable=missing-module-docstring,missing-function-docstring
# pylint: disable=protected-access
from unittest.mock import AsyncMock, Mock, call

import pytest

from app.error_handling.exceptions import RelatedServicesError
from app.schemas.solr_response import RelatedService
from app.utils import ig_related_services


def _service(pid: str, title: str) -> RelatedService:
    return RelatedService(
        pid=pid,
        best_access_right="open",
        title=title,
        resource_organisation="EOSC",
        type="service",
    )


@pytest.mark.asyncio
async def test_fetch_services_from_solr_deduplicates_pids() -> None:
    response = Mock(status_code=200, is_error=False)
    response.json.return_value = {
        "response": {
            "docs": [
                {
                    "pid": ["service-1"],
                    "best_access_right": ["open"],
                    "title": ["Service one"],
                    "resource_organisation": ["EOSC"],
                    "type": ["service"],
                }
            ]
        }
    }
    client = Mock()
    client.post = AsyncMock(return_value=response)

    result = await ig_related_services._fetch_services_from_solr(
        client, ["service-1", "service-1", "service-2"]
    )

    client.post.assert_awaited_once()
    _, kwargs = client.post.call_args
    assert kwargs["json"]["params"] == {
        "q": "*:*",
        "fq": ["{!terms f=pid}service-1,service-2"],
        "fl": "pid,best_access_right,title,resource_organisation,type",
        "rows": 2,
        "wt": "json",
    }
    assert result == {"service-1": _service("service-1", "Service one")}


@pytest.mark.asyncio
async def test_get_related_services_for_guidelines_deduplicates_and_isolates_errors(
    mocker,
) -> None:
    client = Mock()

    async def get_pids(_client, guideline_id):
        if guideline_id == "guideline-2":
            raise RelatedServicesError(detail="Unavailable")
        return ["service-1", "service-1", "service-2"]

    get_pids_mock = mocker.patch(
        "app.utils.ig_related_services._get_related_records_pids",
        side_effect=get_pids,
    )
    fetch_services_mock = mocker.patch(
        "app.utils.ig_related_services._fetch_services_from_solr",
        new=AsyncMock(
            return_value={
                "service-1": _service("service-1", "Service one"),
                "service-2": _service("service-2", "Service two"),
            }
        ),
    )

    result = await ig_related_services.get_related_services_for_guidelines(
        client, ["guideline-1", "guideline-2", "guideline-1"]
    )

    assert get_pids_mock.await_args_list == [
        call(client, "guideline-1"),
        call(client, "guideline-2"),
    ]
    fetch_services_mock.assert_awaited_once_with(
        client, ["service-1", "service-2"]
    )
    assert result == {
        "guideline-1": [
            _service("service-1", "Service one"),
            _service("service-2", "Service two"),
        ],
        "guideline-2": [],
    }


@pytest.mark.asyncio
async def test_get_related_services_for_guidelines_skips_empty_request(
    mocker,
) -> None:
    get_pids_mock = mocker.patch(
        "app.utils.ig_related_services._get_related_records_pids",
        new=AsyncMock(),
    )
    fetch_services_mock = mocker.patch(
        "app.utils.ig_related_services._fetch_services_from_solr",
        new=AsyncMock(),
    )

    result = await ig_related_services.get_related_services_for_guidelines(
        Mock(), []
    )

    assert result == {}
    get_pids_mock.assert_not_awaited()
    fetch_services_mock.assert_not_awaited()
