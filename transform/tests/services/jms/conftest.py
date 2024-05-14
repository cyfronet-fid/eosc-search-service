"""Fixtures used across most jms tests"""

import asyncio
import uuid
from typing import Any, Callable, Coroutine, Generator, Tuple
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.services.jms.connector import JMSMessageHandler, connect
from app.settings import settings


@pytest.fixture
def mock_stomp_connection() -> Generator[MagicMock, None, None]:
    """Provide a mock for stomp.Connection"""
    with patch("stomp.Connection") as mock:
        yield mock()


@pytest.fixture
def subscription_id() -> str:
    """Generate a unique subscription ID."""
    yield f"{settings.STOMP_CLIENT_NAME}-{uuid.uuid4()}"


@pytest.fixture
def jms_handler(
    event_loop: asyncio.AbstractEventLoop,
    mock_stomp_connection: Generator[MagicMock, None, None],
    subscription_id: str,
) -> JMSMessageHandler:
    """Create an instance of JMSMessageHandler with mocked stomp connection and settings."""
    return JMSMessageHandler(
        host=settings.STOMP_HOST,
        port=settings.STOMP_PORT,
        username=settings.STOMP_LOGIN,
        password=settings.STOMP_PASS,
        topics=settings.STOMP_TOPICS,
        subscription_id=subscription_id,
        event_loop=event_loop,
        _ssl=settings.STOMP_SSL,
    )


@pytest.fixture
def message_frame() -> MagicMock:
    """Create a MagickMock instance representing a JMS message frame."""
    return MagicMock(body="Test message")


@pytest.fixture
def mock_conn() -> Generator[AsyncMock, None, None]:
    """Mock the global stomp.Connection."""
    with patch("app.services.jms.connector.conn", new_callable=AsyncMock) as mock:
        mock.is_connected.return_value = True
        yield mock


@pytest.fixture
async def setup_connect_call(
    mock_stomp_connection: Generator[MagicMock, None, None], subscription_id: str
) -> Callable[[], Coroutine[Any, Any, None]]:
    """Set up the asynchronous connect call with mock parameters."""

    async def connect_call() -> None:
        await connect(
            settings.STOMP_HOST,
            settings.STOMP_PORT,
            settings.STOMP_LOGIN,
            settings.STOMP_PASS,
            settings.STOMP_TOPICS,
            subscription_id,
            settings.STOMP_SSL,
        )

    return connect_call


@pytest.fixture(scope="module")
def mocked_stomp_connection() -> (
    Generator[Tuple[MagicMock, MagicMock, MagicMock], None, None]
):
    """Mock the stomp.Connection and related functionalities."""
    with patch("stomp.Connection") as mock_conn_class:
        mock_connection = mock_conn_class.return_value
        mock_connection.is_connected.return_value = True

        # Mock methods used in the connection setup
        mock_connection.connect.return_value = None
        mock_connection.subscribe.return_value = None
        mock_connection.set_listener.return_value = None
        mock_connection.disconnect.return_value = None
        mock_connection.set_ssl.return_value = None

        with patch(
            "app.services.jms.connector.JMSMessageHandler"
        ) as mock_handler_class:
            mock_handler = mock_handler_class.return_value
            yield mock_conn_class, mock_connection, mock_handler


@pytest.fixture
def reset_settings() -> None:
    """Fixture to reset settings after test."""
    original_host = settings.STOMP_HOST
    yield
    settings.STOMP_HOST = original_host


@pytest.fixture
def mock_logger_info() -> MagicMock:
    """Mock the logger.info method."""
    with patch("app.services.jms.connector.logger.info") as mock:
        yield mock


@pytest.fixture
def mock_logger_error() -> MagicMock:
    """Mock the logger.error method."""
    with patch("app.services.jms.connector.logger.error") as mock:
        yield mock


@pytest.fixture
def patch_stomp_subscription_disabled() -> Generator[MagicMock, None, None]:
    """Patch the STOMP_SUBSCRIPTION setting to False."""
    with patch(
        "app.services.jms.connector.settings.STOMP_SUBSCRIPTION", new=False
    ) as mock:
        yield mock


@pytest.fixture
def patch_stomp_subscription_enabled() -> Generator[MagicMock, None, None]:
    """Patch the STOMP_SUBSCRIPTION setting to True."""
    with patch(
        "app.services.jms.connector.settings.STOMP_SUBSCRIPTION", return_value=True
    ) as mock:
        yield mock
