from typing import Generator
from unittest.mock import MagicMock, patch

from app.services.jms.connector import JMSMessageHandler


class TestJMSMessageHandler:
    def test_on_message_logs_info(
        self,
        jms_handler: JMSMessageHandler,
        mock_stomp_connection: Generator[MagicMock, None, None],
        message_frame: MagicMock,
    ) -> None:
        """Test that on_message logs the received message."""
        with patch("app.services.jms.connector.logger.info") as mock_log:
            jms_handler.on_message(message_frame)
            mock_log.assert_called()

    def test_on_message_error_handling(
        self, jms_handler: JMSMessageHandler, message_frame: MagicMock
    ) -> None:
        """Test that on_message handles exceptions during message processing."""
        message_frame.body = ""
        with patch("app.services.jms.connector.process_message") as mock_process, patch(
            "app.services.jms.connector.logger.error"
        ) as mock_log:
            jms_handler.on_error(message_frame)

            mock_log.assert_called_with(
                "%s: Received an error '%s'",
                f"{jms_handler.__class__.__name__}",
                message_frame.body,
            )

    def test_on_message_processes_message(
        self,
        jms_handler: JMSMessageHandler,
        mock_stomp_connection: Generator[MagicMock, None, None],
        message_frame: MagicMock,
    ) -> None:
        """Test that on_message process the message."""
        with patch("app.services.jms.connector.process_message") as mock_process:
            jms_handler.on_message(message_frame)
            mock_process.assert_called_with(message_frame)

    def test_on_error_logs_error(
        self, jms_handler: JMSMessageHandler, message_frame: MagicMock
    ) -> None:
        """Test that on_error logs the error message."""
        message_frame.body = "Error message"
        with patch("app.services.jms.connector.logger.error") as mock_log:
            jms_handler.on_error(message_frame)
            mock_log.assert_called()

    def test_on_message_malformed_message(
        self, jms_handler: JMSMessageHandler, message_frame: MagicMock
    ) -> None:
        """Test handling of malformed messages."""
        message_frame.body = None
        with patch("app.services.jms.connector.logger.error") as mock_log:
            jms_handler.on_message(message_frame)
            mock_log.side_effect = TypeError(
                "the JSON object must be str, bytes or bytearray, not NoneType"
            )
            assert mock_log.call_count == 1

            logged_call_args = mock_log.call_args[0]
            assert (
                "the JSON object must be str, bytes or bytearray, not NoneType"
                in str(logged_call_args)
            )

    def test_on_message_unauthorized_access(
        self, jms_handler: JMSMessageHandler, message_frame: MagicMock
    ) -> None:
        """Test handling of unauthorized access messages."""
        message_frame.body = "Unauthorized access"
        with patch("app.services.jms.connector.process_message") as mock_process:
            mock_process.side_effect = Exception("Unauthorized access")
            with patch("app.services.jms.connector.logger.error") as mock_log:
                jms_handler.on_message(message_frame)
                mock_log.assert_called_with(
                    "Error processing message: %s", mock_process.side_effect
                )
