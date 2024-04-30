from typing import Generator, Tuple
from unittest.mock import MagicMock

from app.services.jms.connector import connect
from app.settings import settings


class TestDynamicConfiguration:
    async def test_runtime_config_changes(
        self,
        mocked_stomp_connection: Generator[
            Tuple[MagicMock, MagicMock, MagicMock], None, None
        ],
        reset_settings: None,
        subscription_id: str,
    ) -> None:
        """Ensure system adapts to runtime config changes."""
        settings.STOMP_HOST = "new_host"
        mock_conn_class, mock_connection, mock_handler = mocked_stomp_connection

        await connect(
            settings.STOMP_HOST,
            settings.STOMP_PORT,
            settings.STOMP_LOGIN,
            settings.STOMP_PASS,
            settings.STOMP_TOPICS,
            subscription_id,
            settings.STOMP_SSL,
        )

        mock_conn_class.assert_called_once_with(
            host_and_ports=[(settings.STOMP_HOST, settings.STOMP_PORT)],
            heartbeats=(10000, 10000),
        )
        mock_connection.connect.assert_called_once_with(
            username=settings.STOMP_LOGIN,
            password=settings.STOMP_PASS,
            wait=True,
            ssl=settings.STOMP_SSL,
        )
