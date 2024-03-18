"""The FastAPI server"""

import logging

from fastapi import FastAPI

from app.api.routes import solr_api_router, transform_api_router
from app.services.jms.connector import close_jms_subscription, start_jms_subscription
from app.settings import settings

logger = logging.getLogger(__name__)


def get_app():
    """Create an application with event handlers and routers"""

    app = FastAPI(
        title="Data Transform Service",
        description="Data Transform Service for EOSC Search Service",
        version="1.0.0",
    )

    app.include_router(router=transform_api_router)
    app.include_router(router=solr_api_router)

    if settings.STOMP_SUBSCRIPTION:

        @app.on_event("startup")
        async def startup_event():
            await start_jms_subscription()

        @app.on_event("shutdown")
        async def shutdown_event():
            await close_jms_subscription()

    return app
