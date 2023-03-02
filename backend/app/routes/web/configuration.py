# pylint: disable=missing-function-docstring
"""The UI application configuration endpoint"""

from fastapi import APIRouter

from app.config import MARKETPLACE_BASE_URL
from app.schemas.configuration_response import ConfigurationResponse

router = APIRouter()


@router.get("/config", name="web:configuration", response_model=ConfigurationResponse)
async def config():
    return ConfigurationResponse(marketplace_url=MARKETPLACE_BASE_URL)
