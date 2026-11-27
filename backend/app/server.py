"""The FastAPI server"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
from starlette.middleware.cors import CORSMiddleware

from app.generic.apis.default_api import router as generic_router
from app.middlewares import LogRequestsMiddleware
from app.routes import internal_api_router, web_api_router
from app.sentry import ApiSentry, sentry_context
from app.tasks import create_start_app_handler, create_stop_app_handler

ApiSentry(sentry_context).start()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run startup and shutdown tasks"""
    await create_start_app_handler(app)()
    yield
    await create_stop_app_handler(app)()


def get_app():
    """Create an application with lifespan handler and routers"""

    app = FastAPI(
        title="Search Service",
        description="EOSC Search Service",
        version="1.0.0-alpha1",
        lifespan=lifespan,
    )
    if sentry_context.enabled:
        app.add_middleware(SentryAsgiMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(LogRequestsMiddleware)

    app.include_router(router=web_api_router, prefix="/api/web")
    app.include_router(router=generic_router, prefix="/v1")
    app.include_router(router=internal_api_router, prefix="/internal")

    return app
