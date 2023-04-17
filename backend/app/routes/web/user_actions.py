# pylint: disable=missing-module-docstring
import logging
import uuid
from typing import Literal

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from starlette.responses import RedirectResponse

from app.config import UI_BASE_URL
from app.dependencies.user_actions import (
    UserActionClient,
    send_user_action_bg_task,
    user_actions_client,
)
from app.schemas.session_data import SessionData
from app.utils.cookie_validators import backend, cookie, verifier

router = APIRouter()
logger = logging.getLogger(__name__)


# pylint: disable=too-many-arguments
@router.get(
    "/navigate",
    name="web:register-navigation-user-action",
)
async def register_navigation_user_action(
    request: Request,
    background_tasks: BackgroundTasks,
    q: str,
    url: str,
    pv: str,
    resource_id: str,
    resource_type: Literal[
        "service",
        "publication",
        "dataset",
        "training",
        "software",
        "data source",
        "data-source",
        "other",
    ],
    page_id: str,
    recommendation: bool = False,
    client: UserActionClient | None = Depends(user_actions_client),
):
    """Registers entering a URL and redirects to the URL"""
    if resource_type == "data-source":
        resource_type = "data source"

    if url.startswith("/"):
        url = UI_BASE_URL + url

    url_params = url
    if "?id" in url:
        url_params = url + "&pv=" + pv + "&q=" + q
    else:
        url_params = url + "?pv=" + pv + "&q=" + q

    response = RedirectResponse(status_code=303, url=url_params)

    try:
        cookie(request)
        session = await verifier(request)
    except HTTPException:
        session_id = uuid.uuid4()

        session = SessionData(
            username=None, aai_state=None, session_uuid=str(uuid.uuid4())
        )
        await backend.create(session_id, session)
        cookie.attach_to_response(response, session_id)

    if not client:
        logger.debug("No mqtt client, user action not sent")
        return response

    background_tasks.add_task(
        send_user_action_bg_task,
        client,
        session,
        url,
        page_id,
        resource_id,
        resource_type,
        recommendation,
    )
    return response
