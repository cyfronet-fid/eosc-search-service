# pylint: disable=line-too-long, too-many-arguments, logging-fstring-interpolation, broad-exception-caught, global-statement
"""Mini framework for JMS interaction"""

import asyncio
import logging
import ssl
import uuid
from typing import List, Union

import stomp
from stomp.exception import ConnectFailedException

from app.settings import settings
from app.transform.live_update.training_ig import process_message

logger = logging.getLogger(__name__)

conn: stomp.Connection | None = None

# Constant
INIT_JMS_RETRY_INTERVAL = 60  # seconds


def subscription_condition(connection: stomp.Connection) -> bool:
    """
    Check if the STOMP connection is currently active.

    Args:
        connection (stomp.Connection): The STOMP connection object.

    Returns:
        bool: True if the connection is active, False otherwise.
    """
    return connection and connection.is_connected()


class JMSMessageHandler(stomp.ConnectionListener):
    """
    Class for handling incoming JMS messages. It acts as a listener for the STOMP connection,
    processing messages, handling errors, and managing disconnections and reconnections.

    Args:
        host (str): The hostname of the JMS server.
        port (int): The port number of the JMS server.
        username (str): Username for authentication.
        password (str): Password for authentication.
        topics (Union[str, List[str]]): Topic or list of topics to subscribe to.
        subscription_id (str): ID for the subscription.
        event_loop (asyncio.AbstractEventLoop): The event loop to use for asynchronous operations.
        _ssl (bool): Flag to indicate if SSL is to be used.
    """

    def __init__(
        self,
        host: str,
        port: int,
        username: str,
        password: str,
        topics: Union[str, List[str]],
        subscription_id: str,
        event_loop: asyncio.AbstractEventLoop,
        _ssl: bool = True,
    ):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.topics = topics
        self.subscription_id = subscription_id
        self.event_loop = event_loop
        self._ssl = _ssl

    def on_message(self, frame):
        """Handle a received message. Logs the message and processes it."""
        try:
            logger.info(
                "%s: Received a message '%s'", self.__class__.__name__, frame.body
            )
            process_message(frame)
        except Exception as e:
            logger.error("Error processing message: %s", e)

    def on_error(self, frame):
        """Handle an error frame. Logs the error contained in the frame."""
        logger.error("%s: Received an error '%s'", self.__class__.__name__, frame.body)

    def on_disconnected(self):
        """Handle disconnection events. Logs the disconnection and attempts to reconnect."""
        logging.warning(
            "%s: Disconnected from the queue. Attempting to reconnect...",
            self.__class__.__name__,
        )
        asyncio.run_coroutine_threadsafe(self.handle_reconnection(), self.event_loop)

    async def handle_reconnection(self):
        """
        Asynchronously handle reconnection attempts. Continues attempts until a successful reconnection is established.
        """
        while not subscription_condition(conn):
            try:
                logger.info("Attempting to reconnect...")
                subscribe(
                    conn,
                    self.host,
                    self.port,
                    self.username,
                    self.password,
                    self.topics,
                    self.subscription_id,
                    self._ssl,
                )
                break
            except Exception as e:
                logger.error(f"Reconnection attempt failed: {e}")
                await asyncio.sleep(INIT_JMS_RETRY_INTERVAL)


def subscribe(
    connection: stomp.Connection,
    host: str,
    port: int,
    username: str,
    password: str,
    topics: Union[str, List[str]],
    subscription_id: str,
    _ssl: bool = True,
) -> None:
    """
    Subscribe to the specified JMS topics.

    Args:
        connection (stomp.Connection): The STOMP connection object.
        host (str): The hostname of the JMS server.
        port (int): The port number of the JMS server.
        username (str): Username for authentication.
        password (str): Password for authentication.
        topics (Union[str, List[str]]): Topic or list of topics to subscribe to.
        subscription_id (str): ID for the subscription.
        _ssl (bool): Flag to indicate if SSL is to be used.
    """
    connection.connect(username=username, password=password, wait=True, ssl=_ssl)
    topics = [topics] if isinstance(topics, str) else topics

    for topic in topics:
        connection.subscribe(destination=topic, id=subscription_id, ack="auto")
        logger.info(
            f"Successfully subscribed to the topic: {topic}, host: {host}:{port}"
        )


async def connect(
    host: str,
    port: int,
    username: str,
    password: str,
    topics: Union[str, List[str]],
    subscription_id: str,
    _ssl: bool = True,
    ssl_version: int = ssl.PROTOCOL_TLS,
) -> None:
    """
    Establishes a connection to the JMS server and subscribes to specified topics.

    Args:
        host (str): The hostname of the JMS server.
        port (int): The port number of the JMS server.
        username (str): Username for authentication.
        password (str): Password for authentication.
        topics (Union[str, List[str]]): Topic or list of topics to subscribe to.
        subscription_id (str): ID for the subscription.
        _ssl (bool): Flag to indicate if SSL is to be used.

    Raises:
        ConnectFailedException: If the connection to the JMS server fails.
        Exception: For general exceptions, usually related to subscription issues.
    """
    global conn
    try:
        heartbeats = (10000, 10000)

        conn = stomp.Connection(host_and_ports=[(host, port)], heartbeats=heartbeats)

        if _ssl:
            conn.set_ssl(for_hosts=[(host, port)], ssl_version=ssl_version)

        event_loop = asyncio.get_running_loop()
        conn.set_listener(
            "JMSMessageHandler",
            JMSMessageHandler(
                host,
                port,
                username,
                password,
                topics,
                subscription_id,
                event_loop,
                _ssl,
            ),
        )
        subscribe(conn, host, port, username, password, topics, subscription_id, _ssl)

    except KeyboardInterrupt:
        logger.warning("KeyboardInterrupt detected, disconnecting from JMS.")
        conn.disconnect()
    except ConnectFailedException as e:
        logger.error(f"Failed to connect to the JMS: {host}:{port}, error: {e}")
        raise
    except Exception as e:
        logger.error(f"Failed to subscribe to certain topics: {topics}, error: {e}")
        raise


async def start_jms_subscription():
    """
    Start a JMS subscription service.

    Continuously attempts to connect to the JMS server and subscribe to specified topics.
    Retries connection in case of failure with a 1-minute interval.

    Raises:
        ConnectFailedException: If unable to establish a connection to the JMS server.
        Exception: For other general exceptions that might occur during the subscription process.
    """
    if not settings.STOMP_SUBSCRIPTION:
        logger.info("STOMP subscription is disabled in settings.")
        return

    while True:
        try:
            logger.info(
                f"Attempting to subscribe to the JMS: {settings.STOMP_HOST}:{settings.STOMP_PORT}, topics: {settings.STOMP_TOPICS}, ssl={settings.STOMP_SSL}"
            )
            await connect(
                host=settings.STOMP_HOST,
                port=settings.STOMP_PORT,
                username=settings.STOMP_LOGIN,
                password=settings.STOMP_PASS,
                topics=settings.STOMP_TOPICS,
                subscription_id=f"{settings.STOMP_CLIENT_NAME}-{uuid.uuid4()}",
                _ssl=settings.STOMP_SSL,
            )
            break
        except ConnectFailedException as e:
            logger.error(
                f"Connection to JMS failed, retrying in {INIT_JMS_RETRY_INTERVAL} seconds... Queue: {settings.STOMP_HOST}:{settings.STOMP_PORT}, error: {e}"
            )
            await asyncio.sleep(INIT_JMS_RETRY_INTERVAL)
        except Exception as e:
            logger.error(
                f"Error during JMS subscription, retrying in {INIT_JMS_RETRY_INTERVAL} seconds... Queue: {settings.STOMP_HOST}:{settings.STOMP_PORT}, error: {e}"
            )
            await asyncio.sleep(INIT_JMS_RETRY_INTERVAL)


async def close_jms_subscription():
    """Close the connection to the JMS."""
    try:
        if conn and subscription_condition(conn) and conn.is_connected():
            logger.info(
                f"Disconnecting from the queue... Queue: {settings.STOMP_HOST}:{settings.STOMP_PORT}"
            )
            if callable(getattr(conn, "disconnect", None)):
                await conn.disconnect()
    except Exception as e:
        logger.error(f"Failed to disconnect from the JMS: {e}")
