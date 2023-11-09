"""The FastAPI server"""

from fastapi import FastAPI
from app.api.routes import transform_api_router


def get_app():
    """Create an application with event handlers and routers"""

    app = FastAPI(
        title="Data Transform Service",
        description="Data transform service for EOSC Search Service",
        version="1.0.0-alpha1",
    )
    app.include_router(router=transform_api_router)

    return app