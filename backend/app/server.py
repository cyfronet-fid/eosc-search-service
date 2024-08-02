"""The FastAPI server"""

import sentry_sdk
from fastapi import FastAPI
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
from starlette.middleware.cors import CORSMiddleware

from app.generic.apis.default_api import router as generic_router
from app.middlewares import LogRequestsMiddleware
from app.routes import internal_api_router, web_api_router
from app.settings import settings
from app.tasks import create_start_app_handler, create_stop_app_handler

if settings.SENTRY_DSN:
    sentry_sdk.init(dsn=settings.SENTRY_DSN)


def get_app():
    """Create an application with event handlers and routers"""

    app = FastAPI(
        title="Search Service",
        description="EOSC Search Service",
        version="1.0.0-alpha1",
    )
    if settings.SENTRY_DSN:
        app.add_middleware(SentryAsgiMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(LogRequestsMiddleware)

    app.add_event_handler("startup", create_start_app_handler(app))
    app.add_event_handler("shutdown", create_stop_app_handler(app))

    app.include_router(router=web_api_router, prefix="/api/web")
    app.include_router(router=generic_router, prefix="/v1")
    app.include_router(router=internal_api_router, prefix="/internal")

    return app
