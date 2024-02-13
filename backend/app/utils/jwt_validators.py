# pylint: disable=missing-module-docstring, missing-function-docstring, no-name-in-module
import json
import urllib.request
from typing import Annotated, Dict

import jwt
from cachetools import TTLCache, cached
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt import algorithms
from sqlalchemy.orm import Session

from app.crud.user import get_user
from app.database import get_db
from app.models.user import User
from app.settings import OIDC_JWT_ENCRYPT_CONFIG

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
cache = TTLCache(maxsize=1, ttl=64800)  # 24h


@cached(cache)
def _pub_keys() -> Dict[str, str]:
    with urllib.request.urlopen(OIDC_JWT_ENCRYPT_CONFIG["public_path"]) as response:
        return {
            jwk["kid"]: algorithms.RSAAlgorithm.from_jwk(jwk)
            for jwk in json.loads(response.read().decode("utf-8"))["keys"]
        }


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)
) -> User:
    try:
        token_header = jwt.get_unverified_header(token)
        key = _pub_keys()[token_header["kid"]]
        decoded_token = jwt.decode(token, key=key, algorithms=token_header["alg"])
        user = get_user(db, decoded_token["sub"])

        if not user:
            # pylint: disable=W0719
            raise Exception

        return user
    except Exception as exc:
        raise HTTPException(
            status_code=401,
            detail="Invalid JWT token.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


async def get_current_provider(
    token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)
) -> User:
    user = await get_current_user(token, db)
    if not user.provider:
        raise HTTPException(
            status_code=401,
            detail=(
                "Insufficient rights. If you want to extend your rights submit a new"
                " ticket at: https://xyz.com/issues/"
            ),
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


async def get_current_admin(
    token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)
) -> User:
    user = await get_current_user(token, db)
    if not user.admin:
        raise HTTPException(
            status_code=401,
            detail=(
                "Insufficient rights. If you want to extend your rights submit a new"
                " ticket at: https://xyz.com/issues/"
            ),
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


async def get_current_super_admin(
    token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)
) -> User:
    user = await get_current_user(token, db)
    if not user.superAdmin:
        raise HTTPException(
            status_code=401,
            detail=(
                "Insufficient rights.If you want to extend your rights submit a new"
                " ticket at: https://xyz.com/issues/"
            ),
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
