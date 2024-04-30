import asyncio
from typing import Any, Callable, Coroutine, Generator
from unittest.mock import AsyncMock, MagicMock


class TestConnectionBehaviors:
    async def test_async_usage(
        self,
        mock_stomp_connection: Generator[MagicMock, None, None],
        setup_connect_call: Callable[[], Coroutine[Any, Any, None]],
    ) -> None:
        """Ensure that asynchronous calls wait for operations to complete."""
        mock_stomp_connection.__aenter__ = AsyncMock(return_value=mock_stomp_connection)
        mock_stomp_connection.__aexit__ = AsyncMock()

        async with mock_stomp_connection as conn:
            task = asyncio.create_task(setup_connect_call())
            await asyncio.sleep(1)
            conn.connect.assert_not_called()
            await task
            conn.connect.assert_called_once()

    async def test_concurrent_connections(
        self,
        mock_stomp_connection: Generator[MagicMock, None, None],
        setup_connect_call: Callable[[], Coroutine[Any, Any, None]],
    ) -> None:
        """Test handling of multiple simultaneous connections."""
        tasks = [asyncio.create_task(setup_connect_call()) for _ in range(10)]
        await asyncio.gather(*tasks)
        assert mock_stomp_connection.connect.call_count == 10
