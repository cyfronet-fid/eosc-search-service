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

logging.basicConfig(filename="app/logs/celery.log", level=logging.INFO)
logger = logging.getLogger(__name__)

conn: stomp.Connection | None = None

# Constant
INIT_JMS_RETRY_INTERVAL = 60 # seconds


def subscription_condition(connection: stomp.Connection) -> bool:
    """
    Check if the STOMP connection is currently active.

    Args:
        connection (stomp.Connection): The STOMP connection object.

    Returns:
        bool: True if the connection is active, False otherwise.
    """
    return connection.is_connected()


class JMSMessageHandler(stomp.ConnectionListener):
    """
    Class for handling incoming JMS messages.

    Args:
        host (str): The hostname of the JMS server.
        port (int): The port number of the JMS server.
        username (str): Username for authentication.
        password (str): Password for authentication.
        topics (Union[str, List[str]]): Topic or list of topics to subscribe to.
        subscription_id (str): ID for the subscription.
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
        _ssl: bool = True,
    ):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.topics = topics
        self.subscription_id = subscription_id
        self._ssl = _ssl

    def on_message(self, frame):
        logger.info("%s: Received a message '%s'", self.__class__.__name__, frame.body)
        process_message(frame)

    def on_error(self, frame):
        logger.error("%s: Received an error '%s'", self.__class__.__name__, frame.body)

    def on_disconnected(self):
        logging.warning(
            "%s: Disconnected from the queue. Attempting to reconnect...", self.__class__.__name__
        )
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
        conn = stomp.Connection(host_and_ports=[(host, port)])
        if _ssl:
            conn.set_ssl(for_hosts=[(host, port)], ssl_version=ssl.PROTOCOL_TLS)
        conn.set_listener(
            "JMSMessageHandler",
            JMSMessageHandler(
                host, port, username, password, topics, subscription_id, _ssl
            ),
        )
        subscribe(conn, host, port, username, password, topics, subscription_id, _ssl)

    except KeyboardInterrupt:
        logger.warning("KeyboardInterrupt detected, disconnecting from JMS.")
        conn.disconnect()
    except ConnectFailedException as e:
        logger.error(f"Failed to connect to the JMS: {host}:{port}, error: {e}")
    except Exception as e:
        logger.error(f"Failed to subscribe to certain topics: {topics}, error: {e}")


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
                f"Connection to JMS failed, retrying in {RETRY_INTERVAL_SECONDS} seconds... Queue: {settings.STOMP_HOST}:{settings.STOMP_PORT}, error: {e}"
            )
            await asyncio.sleep(RETRY_INTERVAL_SECONDS)
        except Exception as e:
            logger.error(
                f"Error during JMS subscription, retrying in {RETRY_INTERVAL_SECONDS} seconds... Queue: {settings.STOMP_HOST}:{settings.STOMP_PORT}, error: {e}"
            )
            await asyncio.sleep(RETRY_INTERVAL_SECONDS)


async def close_jms_subscription():
    """Close the connection to the JMS."""
    try:
        if conn and subscription_condition(conn):
            logger.info(
                f"Disconnecting from the queue... Queue: {settings.STOMP_HOST}:{settings.STOMP_PORT}"
            )
            conn.disconnect()
    except Exception as e:
        logger.error(f"Failed to disconnect from the JMS: {e}")
