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

from search_service.models.extra_models import TokenModel  # noqa: F401
from search_service.models.bad_request import BadRequest
from search_service.models.forbidden import Forbidden
from search_service.models.inline_object import InlineObject
from search_service.models.recommend_results import RecommendResults
from search_service.models.search_results import SearchResults
from search_service.models.unauthorized import Unauthorized
from search_service.security_api import get_token_main_security_scheme

router = APIRouter()


@router.post(
    "/recommend",
    responses={
        200: {"model": RecommendResults, "description": "OK"},
        400: {"model": BadRequest, "description": "Bad request"},
        401: {"model": Unauthorized, "description": "Unauthorized"},
        403: {"model": Forbidden, "description": "Forbidden"},
    },
    tags=["default"],
    summary="Returns results",
)
async def recommend_post(
    inline_object: InlineObject = Body(None, description=""),
    q: str = Query(None, description=""),
    collection: str = Query(None, description=""),
    token_main_security_scheme: TokenModel = Security(
        get_token_main_security_scheme
    ),
) -> RecommendResults:
    ...


@router.get(
    "/search",
    responses={
        200: {"model": SearchResults, "description": "OK"},
        400: {"model": BadRequest, "description": "Bad request"},
        401: {"model": Unauthorized, "description": "Unauthorized"},
        403: {"model": Forbidden, "description": "Forbidden"},
    },
    tags=["default"],
    summary="Returns results",
)
async def search_get(
    q: str = Query(None, description=""),
    collection: str = Query(None, description=""),
    sort: List[str] = Query(None, description="Sorting of the results"),
    cursor: str = Query(None, description=""),
    rows: int = Query(None, description="", ge=0),
    token_main_security_scheme: TokenModel = Security(
        get_token_main_security_scheme
    ),
) -> SearchResults:
    ...
