"""The FastAPI server"""

from fastapi import FastAPI

from app.apis import internal_api_router
from app.generic.apis.default_api import router as generic_router
from app.tasks import create_start_app_handler, create_stop_app_handler


def get_app():
    """Create an application with event handlers and routers"""

    app = FastAPI(
        title="Search Service",
        description="EOSC Search Service",
        version="1.0.0-alpha1",
    )

    app.add_event_handler("startup", create_start_app_handler(app))
    app.add_event_handler("shutdown", create_stop_app_handler(app))

    app.include_router(router=generic_router, prefix="/v1")
    app.include_router(router=internal_api_router, prefix="/internal")

    return app
