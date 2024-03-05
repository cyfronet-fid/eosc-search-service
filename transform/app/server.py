"""The FastAPI server"""

from fastapi import FastAPI
import logging
import threading

from app.api.routes import transform_api_router, solr_api_router
from app.jms import subscribe_to_topics
from app.settings import settings

logger = logging.getLogger(__name__)


def start_jms_subscriber():
    """Starts the JMS subscriber in a separate thread."""

    def run_subscriber():
        logger.info("Starting JMS subscriber...")

        subscribe_to_topics(
            host=settings.STOMP_HOST,
            port=settings.STOMP_PORT,
            username=settings.STOMP_LOGIN,
            password=settings.STOMP_PASS,
            topics=settings.STOMP_PC_TOPICS,
            ssl=settings.STOMP_SSL,
        )

    thread = threading.Thread(target=run_subscriber, daemon=True)
    thread.start()


def get_app():
    """Create an application with event handlers and routers"""

    app = FastAPI(
        title="Data Transform Service",
        description="Data Transform Service for EOSC Search Service",
        version="1.0.0",
    )

    @app.on_event("startup")
    async def startup_event():
        start_jms_subscriber()

    app.include_router(router=transform_api_router)
    app.include_router(router=solr_api_router)

    return app
