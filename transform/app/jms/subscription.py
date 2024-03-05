import logging
import threading
from typing import Callable, List, Optional
import uuid
from .connector import default_subscription_condition, subscribe_to_queue
from app.settings import settings


# pylint: disable=too-many-arguments
def subscribe_to_topics(
    host: str,
    port: int,
    username: str,
    password: str,
    topics: List[str],
    ssl: bool,
    _logger: Optional[logging.Logger] = None,
    subscription_condition: Optional[Callable] = default_subscription_condition,
):
    """Subscribes to multiple STOMP topics, each with a unique subscription ID."""

    def subscribe_to_topic(topic):
        subscription_id = f"{settings.STOMP_CLIENT_NAME}-{uuid.uuid4()}"
        subscribe_to_queue(
            host=host,
            port=port,
            username=username,
            password=password,
            topic=topic,
            subscription_id=subscription_id,
            _ssl=ssl,
            _logger=_logger,
            subscription_condition=subscription_condition,
        )

    for topic in topics:
        thread = threading.Thread(target=subscribe_to_topic, args=(topic,))
        thread.start()
        if _logger is None:
            _logger = logging.getLogger(__name__)
            _logger.info(f"Started thread for topic: {topic}")


