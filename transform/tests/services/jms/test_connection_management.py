import asyncio
import ssl
from typing import Any, Callable, Coroutine, Generator, Tuple
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from stomp.exception import ConnectFailedException

from app.services.jms.connector import JMSMessageHandler, connect
from app.settings import settings


class TestJMSConnection:
    async def test_connection_success(
        self,
        mock_stomp_connection: Generator[MagicMock, None, None],
        subscription_id: str,
    ) -> None:
        """Test successful connection setup."""
        await connect(
            settings.STOMP_HOST,
            settings.STOMP_PORT,
            settings.STOMP_LOGIN,
            settings.STOMP_PASS,
            settings.STOMP_TOPICS,
            subscription_id,
            settings.STOMP_SSL,
        )

        mock_stomp_connection.connect.assert_called_with(
            password=settings.STOMP_PASS,
            ssl=settings.STOMP_SSL,
            username=settings.STOMP_LOGIN,
            wait=True,
        )

    async def test_connect_failure_with_invalid_parameters(
        self, mock_stomp_connection: Generator[MagicMock, None, None]
    ) -> None:
        """Test connection failure due to invalid connection parameters."""
        mock_stomp_connection.connect.side_effect = ConnectFailedException(
            "Invalid connection parameters"
        )
        with pytest.raises(ConnectFailedException):
            await connect(
                host="invalid_host",
                port=9999,
                username="invalid_user",
                password="invalid_pass",
                topics=settings.STOMP_TOPICS,
                subscription_id="invalid-subscription",
                _ssl=settings.STOMP_SSL,
            )

    async def test_error_handling_on_network_failure(
        self,
        mock_stomp_connection: Generator[MagicMock, None, None],
        setup_connect_call: Callable[[], Coroutine[Any, Any, None]],
    ) -> None:
        """Test how connection handles network failures."""
        mock_stomp_connection.connect.side_effect = OSError("Network failure")
        with pytest.raises(OSError):
            await setup_connect_call()

    async def test_reconnection_logic_under_intermittent_failures(
        self,
        mock_stomp_connection: Generator[MagicMock, None, None],
        jms_handler: JMSMessageHandler,
    ) -> None:
        """Test reconnection logic under intermittent network failures."""
        failure_then_success = [ConnectFailedException("Connection failed"), None]
        mock_stomp_connection.connect.side_effect = failure_then_success

        with patch(
            "app.services.jms.connector.asyncio.sleep", new_callable=AsyncMock
        ) as mock_sleep:
            with patch(
                "app.services.jms.connector.subscription_condition",
                side_effect=[False, False, True],
            ) as mock_subscription_condition:  # Simulate the condition checks
                with patch(
                    "app.services.jms.connector.conn", new=mock_stomp_connection
                ):
                    await jms_handler.handle_reconnection()

                    assert mock_sleep.call_count == 1

                    assert mock_stomp_connection.connect.call_count == 2

    async def test_on_disconnected_triggers_reconnection(
        self, jms_handler: JMSMessageHandler
    ) -> None:
        """Test that on_disconnect attempts to reconnect."""
        with patch.object(
            jms_handler, "handle_reconnection", new_callable=AsyncMock
        ) as mock_handle_reconnection:
            jms_handler.on_disconnected()
            await asyncio.sleep(0)  # Ensure the event loop runs the async call
            mock_handle_reconnection.assert_called_once()


class TestJMSConnectionSSL:
    async def test_ssl_configuration_handling(
        self,
        mocked_stomp_connection: Generator[
            Tuple[MagicMock, MagicMock, MagicMock], None, None
        ],
    ) -> None:
        """Test handling of different SSL configurations."""
        mock_conn_class, mock_connection, mock_handler = mocked_stomp_connection

        await connect(
            host=settings.STOMP_HOST,
            port=settings.STOMP_PORT,
            username=settings.STOMP_LOGIN,
            password=settings.STOMP_PASS,
            topics=settings.STOMP_TOPICS,
            subscription_id="ssl-test",
            _ssl=True,
        )
        mock_connection.set_ssl.assert_called_once()

    async def test_invalid_ssl_certificate(
        self, mock_stomp_connection: Generator[MagicMock, None, None]
    ) -> None:
        """Test  connection failure due to an invalid SSL certificate."""
        mock_stomp_connection.set_ssl.side_effect = ssl.SSLError(
            "Invalid SSL certificate"
        )

        with pytest.raises(ssl.SSLError):
            await connect(
                host=settings.STOMP_HOST,
                port=settings.STOMP_PORT,
                username=settings.STOMP_LOGIN,
                password=settings.STOMP_PASS,
                topics=settings.STOMP_TOPICS,
                subscription_id="ssl-error-test",
                _ssl=True,
            )

            mock_stomp_connection.set_ssl.assert_called_once()

    @pytest.mark.parametrize(
        "ssl_version", [ssl.PROTOCOL_TLSv1_2, ssl.PROTOCOL_TLSv1_1]
    )
    async def test_ssl_protocol_versions(
        self,
        mocked_stomp_connection: Generator[
            Tuple[MagicMock, MagicMock, MagicMock], None, None
        ],
        ssl_version: int,
    ) -> None:
        """Test connection with different SSL protocols."""
        mock_conn_class, mock_connection, mock_handler = mocked_stomp_connection

        await connect(
            settings.STOMP_HOST,
            settings.STOMP_PORT,
            settings.STOMP_LOGIN,
            settings.STOMP_PASS,
            settings.STOMP_TOPICS,
            "ssl-protocol-test",
            True,
            ssl_version,
        )

        mock_connection.set_ssl.assert_called_with(
            for_hosts=[(settings.STOMP_HOST, settings.STOMP_PORT)],
            ssl_version=ssl_version,
        )

    async def test_ssl_handshake_failure(
        self, mock_stomp_connection: Generator[MagicMock, None, None]
    ) -> None:
        """Test connection failure due to SSL handshake issues."""
        mock_stomp_connection.set_ssl.side_effect = ssl.SSLError("SSL handshake failed")

        with pytest.raises(ssl.SSLError):
            await connect(
                settings.STOMP_HOST,
                settings.STOMP_PORT,
                settings.STOMP_LOGIN,
                settings.STOMP_PASS,
                settings.STOMP_TOPICS,
                "ssl-handshake-test",
                True,
            )

    async def test_unexpected(
        self,
        mock_stomp_connection: Generator[MagicMock, None, None],
        setup_connect_call: Callable[[], Coroutine[Any, Any, None]],
    ) -> None:
        """Test handling of unexpected exceptions during connection setup."""
        mock_stomp_connection.connect.side_effect = Exception("Unexpected error")
        with pytest.raises(Exception) as exc:
            await setup_connect_call()
        assert "Unexpected error" in str(exc.value)
