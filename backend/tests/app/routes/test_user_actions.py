# pylint: disable=missing-module-docstring,missing-function-docstring,missing-class-docstring
import json
import urllib.parse
from time import sleep

import pytest
import stomp
from fastapi import FastAPI
from httpx import AsyncClient, Response
from pytest_lazyfixture import lazy_fixture
from starlette.status import HTTP_303_SEE_OTHER
from stomp.utils import Frame

from app.settings import settings
from tests.utils import UserSession

Seconds = float


class TimeoutException(Exception):
    pass


class MockListener(stomp.ConnectionListener):
    """Test listener"""

    def __init__(self, timeout: Seconds = 10):
        self.timeout = timeout
        self.error = None
        self._last_message = None

    def on_error(self, frame: Frame):
        self.error = frame

    def on_message(self, frame: Frame):
        self._last_message = json.loads(frame.body)

    @property
    def last_message(self) -> dict:
        elapsed = 0
        while True:
            if elapsed >= self.timeout:
                raise TimeoutException
            if self.error:
                return self.error
            if self._last_message:
                return self._last_message
            sleep(1)
            elapsed += 1


async def call_navigate_api(app: FastAPI, client: AsyncClient) -> Response:
    return await client.get(
        app.url_path_for("web:register-navigation-user-action"),
        params={
            "url": urllib.parse.quote("https://anothersite.org/path/deeppath"),
            "return_path": "search/all",
            "search_params": "q%3D%2A",
            "resource_id": "123",
            "resource_type": "service",
            "page_id": "/search/all",
            "recommendation": "0",
        },
    )


@pytest.mark.integration
@pytest.mark.asyncio
async def test_redirects_to_the_target_url_and_set_session_cookie(
    app: FastAPI, client: AsyncClient
):
    res = await call_navigate_api(app, client)

    assert res.status_code == HTTP_303_SEE_OTHER
    assert res.headers.get("set-cookie", {}) != {}


@pytest.mark.integration
@pytest.mark.asyncio
async def test_includes_user_action_continuation_data(
    app: FastAPI, client: AsyncClient
):
    res = await call_navigate_api(app, client)
    assert res.next_request.url.params.get("source_id")
    assert res.next_request.url.params.get("client_uid")


@pytest.mark.integration
@pytest.mark.asyncio
async def test_redirects_does_not_set_cookie_for_authorized_user(
    app: FastAPI, auth_client: AsyncClient
):
    res = await call_navigate_api(app, auth_client)

    assert res.status_code == HTTP_303_SEE_OTHER
    assert res.headers.get("set-cookie", {}) == {}


@pytest.mark.parametrize("client_", (lazy_fixture(("client", "auth_client"))))
@pytest.mark.integration
@pytest.mark.asyncio
async def test_sends_user_action_after_response(app: FastAPI, client_: AsyncClient):
    conn = stomp.Connection(host_and_ports=[(settings.STOMP_HOST, settings.STOMP_PORT)])
    listener = MockListener()
    conn.set_listener("test_listener", listener)
    conn.connect(settings.STOMP_LOGIN, settings.STOMP_PASS, wait=True)
    conn.subscribe(
        settings.STOMP_USER_ACTIONS_TOPIC, settings.STOMP_CLIENT_NAME, ack="auto"
    )

    await call_navigate_api(app, client_)

    message = listener.last_message
    message = json.loads(message)

    assert message["action"] == {"order": False, "text": "", "type": "browser action"}
    assert message["client_id"] == "search_service"
    assert message["source"]["page_id"] == "/search/all"
    assert message["source"]["root"] == {
        "resource_id": "123",
        "resource_type": "service",
        "type": "other",
    }
    assert message["source"]["visit_id"] is not None
    assert message["target"]["page_id"] == "/path/deeppath"
    assert message["target"]["visit_id"] is not None
    assert message["timestamp"] is not None
    assert message["unique_id"] is not None


@pytest.mark.integration
@pytest.mark.asyncio
async def test_sends_aai_uid_in_user_action_for_signed_in_user(
    app: FastAPI, auth_client: AsyncClient, user_session: UserSession
):
    conn = stomp.Connection(host_and_ports=[(settings.STOMP_HOST, settings.STOMP_PORT)])
    listener = MockListener()
    conn.set_listener("test_listener", listener)
    conn.connect(settings.STOMP_LOGIN, settings.STOMP_PASS, wait=True)
    conn.subscribe(
        settings.STOMP_USER_ACTIONS_TOPIC, settings.STOMP_CLIENT_NAME, ack="auto"
    )

    await call_navigate_api(app, auth_client)

    message = listener.last_message
    message = json.loads(message)

    assert message["aai_uid"] == user_session.session_data.aai_id
