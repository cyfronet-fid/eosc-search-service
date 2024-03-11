"""The FastAPI server"""

from fastapi import FastAPI
import logging
from app.api.routes import transform_api_router, solr_api_router

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

    return app
