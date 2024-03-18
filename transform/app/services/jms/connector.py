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


def subscription_condition(connection: stomp.Connection) -> bool:
    """Is it connected?"""
    return connection.is_connected()


class JMSMessageHandler(stomp.ConnectionListener):
    """Class for handling incoming JMS messages"""

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
        logger.debug("Received a message '%s'", frame.body)
        process_message(frame)

    def on_error(self, frame):
        logger.error("Received an error '%s'", frame.body)

    def on_disconnected(self):
        logging.warning("Got disconnected from the queue. Attempting to reconnect...")
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
    """Subscribe to the topics"""
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
    """Make a connection to the JMS"""
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
        conn.disconnect()
    except ConnectFailedException:
        logger.error(f"Failed to connect to the queue: {host}:{port}")
    except Exception as e:
        logger.error(f"Failed to subscribe to certain topics: {topics}, error: {e}")


async def start_jms_subscription():
    """Start JMS subscription."""
    if not settings.STOMP_SUBSCRIPTION:
        return

    while True:
        try:
            logger.info(
                f"Trying to subscribe to the queue: {settings.STOMP_HOST}:{settings.STOMP_PORT}, topics: {settings.STOMP_TOPICS}, ssl={settings.STOMP_SSL}"
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
        except Exception as e:
            logger.error(
                f"Failed to connect to the queue, retrying in 1 minute... Queue: {settings.STOMP_HOST}:{settings.STOMP_PORT}, error: {e}"
            )
            await asyncio.sleep(60)


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
