from typing import Any, Callable, Coroutine, Generator
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from stomp.exception import ConnectFailedException

from app.services.jms.connector import (
    close_jms_subscription,
    connect,
    start_jms_subscription,
    subscribe,
)
from app.settings import settings


class TestJMSSubscription:
    async def test_subscription_setup_success(
        self,
        mock_stomp_connection: Generator[MagicMock, None, None],
        setup_connect_call: Callable[[], Coroutine[Any, Any, None]],
        subscription_id: str,
    ) -> None:
        """Test successful subscription setup."""
        with patch("app.services.jms.connector.subscribe") as mock_subscribe:
            await setup_connect_call()
            mock_subscribe.assert_called_with(
                mock_stomp_connection,
                settings.STOMP_HOST,
                settings.STOMP_PORT,
                settings.STOMP_LOGIN,
                settings.STOMP_PASS,
                settings.STOMP_TOPICS,
                subscription_id,
                settings.STOMP_SSL,
            )

    async def test_start_jms_subscription_terminates_on_disabled_setting(
        self, mock_stomp_connection: Generator[MagicMock, None, None]
    ) -> None:
        """Test that start_jms_subscription terminates if subscriptions are disabled."""
        with patch("app.services.jms.connector.settings.STOMP_SUBSCRIPTION", new=False):
            with patch("app.services.jms.connector.connect") as mock_connect:
                await start_jms_subscription()
                mock_connect.assert_not_called()

    async def test_close_jms_subscription_disconnects_if_connected(
        self,
        mock_conn: Generator[AsyncMock, None, None],
        mock_logger_info: MagicMock,
        patch_stomp_subscription_enabled: Generator[MagicMock, None, None],
    ) -> None:
        """Test that close_jms_subscription disconnects if the connection is active."""
        mock_conn.is_connected = MagicMock(return_value=True)
        await close_jms_subscription()
        mock_logger_info.assert_called()
        mock_conn.disconnect.assert_awaited()

    async def test_close_jms_subscription_does_nothing_if_disconnected(
        self,
        mock_conn: Generator[AsyncMock, None, None],
        mock_logger_error: MagicMock,
        patch_stomp_subscription_disabled: Generator[MagicMock, None, None],
    ) -> None:
        """Test that close_jms_subscription does nothing if already disconnected."""
        mock_conn.is_connected = MagicMock(return_value=False)
        await close_jms_subscription()
        mock_logger_error.assert_not_called()
        mock_conn.disconnect.assert_not_called()

    async def test_start_jms_subscription_with_connection_failure(
        self,
        mock_conn: Generator[AsyncMock, None, None],
        mock_stomp_connection: Generator[MagicMock, None, None],
        mock_logger_error: MagicMock,
        patch_stomp_subscription_enabled: Generator[MagicMock, None, None],
    ) -> None:
        """Test that the system retries connection after a ConnectFailedException."""
        max_retries = 5

        async def fake_connect(*args, **kwargs):
            if fake_connect.call_count < max_retries:
                fake_connect.call_count += 1
                raise ConnectFailedException("Connection failed")

        fake_connect.call_count = 0

        with patch(
            "app.services.jms.connector.connect",
            new=AsyncMock(side_effect=fake_connect),
        ), patch("app.services.jms.connector.INIT_JMS_RETRY_INTERVAL", new=1):

            await start_jms_subscription()

            assert mock_logger_error.call_count == max_retries
            mock_logger_error.assert_called_with(
                f"Connection to JMS failed, retrying in 1 seconds..."
                f" Queue: {settings.STOMP_HOST}:{settings.STOMP_PORT}, error: Connection failed"
            )

    async def test_subscription_failure_invalid_topic(
        self, mock_stomp_connection: Generator[MagicMock, None, None]
    ) -> None:
        """Test subscription failure due to invalid topics."""
        mock_stomp_connection.subscribe.side_effect = Exception("Invalid topic")

        with pytest.raises(Exception) as exc_info:
            await subscribe(
                mock_stomp_connection,
                settings.STOMP_HOST,
                settings.STOMP_PORT,
                settings.STOMP_LOGIN,
                settings.STOMP_PASS,
                "invalid/topic",
                "subscription-invalid-topic",
                settings.STOMP_SSL,
            )
        assert "Invalid topic" in str(exc_info.value)

    async def test_subscription_failure_server_issue(
        self, mock_stomp_connection: Generator[MagicMock, None, None]
    ) -> None:
        """Test failure to subscribe due to server issues."""
        mock_stomp_connection.connect.side_effect = ConnectFailedException(
            "Server error"
        )

        with pytest.raises(ConnectFailedException):
            await connect(
                settings.STOMP_HOST,
                settings.STOMP_PORT,
                settings.STOMP_LOGIN,
                settings.STOMP_PASS,
                settings.STOMP_TOPICS,
                "subscription-server-issue",
                settings.STOMP_SSL,
            )

    async def test_subscription_toggle(
        self,
        mock_logger_info: MagicMock,
        patch_stomp_subscription_disabled: Generator[MagicMock, None, None],
    ) -> None:
        """Test toggling subscription settings."""
        await start_jms_subscription()
        mock_logger_info.assert_called_with(
            "STOMP subscription is disabled in settings."
        )
