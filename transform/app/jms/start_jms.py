import logging
import uuid
from app.jms.connector import subscribe_to_topics
from app.settings import settings

logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting JMS subscriber...")
    subscribe_to_topics(
        host=settings.STOMP_HOST,
        port=settings.STOMP_PORT,
        username=settings.STOMP_LOGIN,
        password=settings.STOMP_PASS,
        topics=settings.STOMP_PC_TOPICS,
        subscription_id=f"{settings.STOMP_CLIENT_NAME}-{uuid.uuid4()}",
        _ssl=settings.STOMP_SSL,
        _logger=logger,
    )
