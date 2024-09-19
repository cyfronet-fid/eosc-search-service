# pylint: disable=missing-module-docstring,unused-import
# coding: utf-8

from typing import Dict, List

from fastapi import (
    APIRouter,
    Body,
    Cookie,
    Depends,
    Form,
    Path,
    Query,
    Response,
    Security,
    status,
)

from app.db.repositories.dumps import DumpsRepository
from app.dependencies.database import get_repo
from app.generic.models.bad_request import BadRequest
from app.generic.models.dump import Dump
from app.generic.models.dump_elements import DumpElements
from app.generic.models.dump_results import DumpResults
from app.generic.models.extra_models import TokenModel
from app.generic.models.forbidden import Forbidden
from app.generic.models.unauthorized import Unauthorized
from app.generic.security_api import get_token_main_security_scheme

router = APIRouter()


@router.get(
    "/dumps",
    response_model=DumpResults,
    responses={
        200: {"model": DumpResults, "description": "OK"},
        400: {"model": BadRequest, "description": "Bad request"},
        401: {"model": Unauthorized, "description": "Unauthorized"},
        403: {"model": Forbidden, "description": "Forbidden"},
    },
    tags=["v1"],
    summary="Returns available dumps",
)
async def dumps_get(
    cursor: str = Query(None, description=""),
    rows: int = Query(None, description="", ge=0, le=100),
    token_main_security_scheme: TokenModel = Security(get_token_main_security_scheme),
    dumps_repo: DumpsRepository = Depends(get_repo(DumpsRepository)),
) -> DumpResults:
    """Returns available dumps"""
    # pylint: disable=unused-argument
    return DumpResults(dumps=dumps_repo.list_all_dumps())
