# pylint: disable=missing-module-docstring,broad-except,missing-function-docstring,cyclic-import,use-dict-literal
import uuid
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, Response
from starlette import status
from starlette.responses import RedirectResponse

from app.schemas.session_data import SessionData
from app.schemas.user_info_response import UserInfoResponse
from app.settings import settings
from app.utils.cookie_validators import backend, cookie, verifier
from app.utils.rp_handler import rp_handler

router = APIRouter()


@router.get("/request")
async def auth_request():
    try:
        result = rp_handler.begin(issuer_id=settings.OIDC_ISSUER)
    except Exception as err:
        raise HTTPException(
            status_code=400, detail=f"Something went wrong: {err} {repr(err)}"
        ) from err
    return RedirectResponse(status_code=303, url=result["url"])


@router.get("/checkin")
async def auth_checkin(code: str, state: str):
    if not state:
        return RedirectResponse(status_code=400, url=settings.UI_BASE_URL)

    try:
        aai_response = rp_handler.finalize(
            settings.OIDC_ISSUER, dict(code=code, state=state)
        )

        session_id = uuid4()
        username = aai_response["userinfo"]["name"]
        aai_id = aai_response["userinfo"]["sub"]

        session_data = SessionData(
            username=username,
            aai_state=state,
            aai_id=aai_id,
            session_uuid=str(uuid.uuid4()),
        )
        await backend.create(session_id, session_data)
        auth_response = RedirectResponse(status_code=303, url=settings.UI_BASE_URL)
        cookie.attach_to_response(auth_response, session_id)
        return auth_response
    except Exception:
        return RedirectResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            url=settings.UI_BASE_URL,
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.get(
    "/userinfo", dependencies=[Depends(cookie)], response_model=UserInfoResponse
)
async def user_info(session_data: SessionData = Depends(verifier)) -> UserInfoResponse:
    if session_data.username is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return UserInfoResponse(username=session_data.username)


@router.get("/logout")
async def logout(response: Response, session_id: UUID = Depends(cookie)):
    try:
        await backend.delete(session_id)
    except KeyError:
        pass

    cookie.delete_from_response(response)
    return RedirectResponse(status_code=303, url=settings.UI_BASE_URL)
