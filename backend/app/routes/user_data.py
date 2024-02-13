# pylint: disable=missing-module-docstring, no-name-in-module, missing-function-docstring
import json
from typing import Any, Dict

import jwt
import jwt.exceptions
from benedict import benedict
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.crud.user import create_user, get_user
from app.database import get_db
from app.models.api.user_data import UserDataProps
from app.models.user import User
from app.settings import settings

router = APIRouter()


def get_proxied_user(
    x_client_token: str | None = Header(default=None), db: Session = Depends(get_db)
) -> User:
    decoded_token = jwt.decode(x_client_token, options={"verify_signature": False})
    assert decoded_token["iss"] == settings.OIDC_ISSUER
    aai_id = decoded_token["sub"]
    user = get_user(db, aai_id)
    if user is None:
        user = create_user(db, aai_id)
    return user


@router.get("/fav", response_model=UserDataProps)
async def user_data(user: User = Depends(get_proxied_user)):
    """
    Get user data. This is API for EOSC service providers who
    want to integrate with the common user data store.

    To get user's data authorization via `Authorization` header is required, together with user with
    provider's priviledges. Additionally `X-Client-Token` should be set to the user's JWT token
    which it obtains during signing in via AAI.
    """
    return UserDataProps.parse_obj(user.data.data)


@router.post("/fav/{types}", status_code=204)
async def add_user_data(
    types: str,
    data: Dict[str, Any] | list[Any],
    user: User = Depends(get_proxied_user),
    db: Session = Depends(get_db),
):
    if types not in [
        "publications",
        "datasets",
        "software",
        "services",
        "datasources",
        "trainings",
        "other",
        "news",
        "othermisc",
    ]:
        raise HTTPException(
            status_code=400, detail="bad type when updating list object"
        )

    user_props = benedict(UserDataProps.parse_obj(user.data.data).dict())
    requested_data = user_props["favorites"][types]

    if not isinstance(data, list):
        raise HTTPException(
            status_code=400, detail="list required when updating list object"
        )

    if isinstance(requested_data, list):
        for element in data:
            notfound = True
            for elementin in requested_data:
                if (
                    element["url"] == elementin["url"]
                    and element["title"] == elementin["title"]
                ):
                    notfound = False
            if notfound:
                requested_data.append(element)
        user.data.data = json.loads(UserDataProps.parse_obj(user_props).json())
        db.add(user.data)
        db.commit()


@router.delete("/fav/{types}", status_code=204)
async def delete_user_data(
    types: str,
    data: Dict[str, Any] | list[Any],
    user: User = Depends(get_proxied_user),
    db: Session = Depends(get_db),
) -> None:
    if types not in [
        "publications",
        "datasets",
        "software",
        "services",
        "datasources",
        "trainings",
        "other",
        "news",
        "othermisc",
    ]:
        raise HTTPException(
            status_code=400, detail="bad type when updating list object"
        )

    user_props = benedict(UserDataProps.parse_obj(user.data.data).dict())
    requested_data = user_props["favorites"][types]

    if not isinstance(data, list):
        raise HTTPException(
            status_code=400, detail="list required when updating list object"
        )

    if isinstance(requested_data, list):
        for element in data:
            for elementin in requested_data:
                if (
                    element["url"] == elementin["url"]
                    and element["title"] == elementin["title"]
                ):
                    print("Removing element.." + elementin["title"])
                    requested_data.remove(elementin)

        user.data.data = json.loads(UserDataProps.parse_obj(user_props).json())
        db.add(user.data)
        db.commit()
