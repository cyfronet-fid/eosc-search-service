# pylint: disable=missing-function-docstring
import json
import logging
from stat import FILE_ATTRIBUTE_VIRTUAL

from typing import Literal
from starlette import status

from fastapi import APIRouter, Depends, HTTPException, Request
from httpx import AsyncClient

from app.dependencies.user_actions import (
    user_actions_client,
)
from app.settings import settings
from app.utils.cookie_validators import cookie, verifier
from app.schemas.favourite_response import FavouriteResponse

from app.schemas.session_data import SessionData

from typing import Dict, Any

# FAV_MOCK = False

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get(
    "/favourites",
    name="web:get-favourites-list",
    #responses={200: {"model": FavouriteResponse}} #, 500: {"model": dict}},
    #response_model=FavouriteResponse,
)
async def get_favourites_list(
    request: Request,
    client: AsyncClient | None = Depends(user_actions_client),
):
    """Get all user's favourites list"""

    try:
        #cookie(request)
        session = await verifier(request)
        access_token = request.session.get("access_token")
        access_token = request.headers.get("Authorization")

        if not access_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

        headers = {
            "Authorization": f"Bearer {access_token}"
        }

        async with client:
            response = await client.get(
                settings.FAVOURITE_API_URL,
                headers=headers,
                params={}
            )

        response.raise_for_status()
        return response.json()

    except HTTPException:
        raise
    except Exception as ex:
        print(ex)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Service Unavailable")



@router.post(
    "/favourites",
    name="web:add-to-the-favourites",
    status_code=status.HTTP_201_CREATED,
)
async def add_to_the_favourites(
    request: Request,
    resource_type: Literal[
        "adapter",
        "service",
        "publication",
        "dataset",
        "training",
        "software",
        "data source",
        "data-source",
        "other",
        "guideline",
        "bundle",
        "provider",
        "project",
        "organisation",
        "catalogue",
        "deployable service",
        "deployable-service",
    ],
    pid: str,
    client: AsyncClient | None = Depends(user_actions_client),
    session_data: SessionData = Depends(verifier)
):
    try:
        access_token = session_data.access_token

        if not access_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

        headers = {
            "Authorization": f"Bearer {access_token}"
        }

        async with client:
            response = await client.post(
                settings.FAVOURITE_API_URL,
                headers=headers,
                json={
                    "pid":pid,
                    "resource_type":resource_type
                },
            )

        response.raise_for_status()
        return response.json()

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Service Unavailable")


@router.delete(
    "/favourites",
    name="web:remove-from-the-favourites",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_from_the_favourites(
    request: Request,
    resource_type: Literal[
        "adapter",
        "service",
        "publication",
        "dataset",
        "training",
        "software",
        "data source",
        "data-source",
        "other",
        "guideline",
        "bundle",
        "provider",
        "project",
        "organisation",
        "catalogue",
        "deployable service",
        "deployable-service",
    ],
    pid : str,
    client: AsyncClient | None = Depends(user_actions_client),
    session_data: SessionData = Depends(verifier)
):
    try:

        access_token = session_data.access_token

        if not access_token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

        headers = {
            "Authorization": f"Bearer {access_token}"
        }

        async with client:
            response = await client.delete(
                settings.FAVOURITE_API_URL,
                headers=headers,
                params={
                    "pid": pid,
                    "resource_type": resource_type
                },
            )

        response.raise_for_status()
        return response.json()

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Service Unavailable")
