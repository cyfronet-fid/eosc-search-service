# coding: utf-8

from typing import Dict, List  # noqa: F401

from fastapi import (  # noqa: F401
    APIRouter,
    Body,
    Cookie,
    Depends,
    Form,
    Header,
    Path,
    Query,
    Response,
    Security,
    status,
)

from openapi_server.models.extra_models import TokenModel  # noqa: F401
from openapi_server.models.bad_request import BadRequest
from openapi_server.models.search_results import SearchResults


router = APIRouter()


@router.get(
    "/search",
    responses={
        200: {"model": SearchResults, "description": "OK"},
        400: {"model": BadRequest, "description": "Bad request"},
    },
    tags=["default"],
)
async def search_get(
    q: str = Query(None, description=""),
    collection: str = Query(None, description=""),
    cursor: str = Query(None, description=""),
    rows: int = Query(None, description="", ge=0),
) -> SearchResults:
    """Returns results"""
    ...
