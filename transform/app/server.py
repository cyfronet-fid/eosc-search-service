"""The FastAPI server"""

import logging.config

import sentry_sdk
from fastapi import FastAPI
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
from sentry_sdk.integrations.celery import CeleryIntegration
from sentry_sdk.integrations.redis import RedisIntegration

from app.api.endpoints import solr_api_router, transform_api_router
from app.logger import LOGGING_CONFIG
from app.services.jms.connector import close_jms_subscription, start_jms_subscription
from app.settings import settings


def get_app():
    """Create an application with event handlers and routers"""

    app = FastAPI(
        title="Data Transform Service",
        description="Data Transform Service for EOSC Search Service",
        version="1.0.0",
    )

    app.include_router(router=transform_api_router)
    app.include_router(router=solr_api_router)

    if settings.SENTRY_DSN:
        sentry_sdk.init(dsn=settings.SENTRY_DSN)
        app.add_middleware(SentryAsgiMiddleware)
        sentry_sdk.init(
            integrations=[CeleryIntegration(), RedisIntegration()],
            traces_sample_rate=1.0,
        )

    if settings.STOMP_SUBSCRIPTION:

        @app.on_event("startup")
        async def startup_event():
            logging.config.dictConfig(LOGGING_CONFIG)
            await start_jms_subscription()

        @app.on_event("shutdown")
        async def shutdown_event():
            await close_jms_subscription()

    return app
