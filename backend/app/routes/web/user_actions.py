# pylint: disable=missing-module-docstring
import uuid
from typing import Literal

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from starlette.responses import RedirectResponse

from app.dependencies.user_actions import (
    UserActionClient,
    send_user_action_bg_task,
    user_actions_client,
)
from app.schemas.session_data import SessionData
from app.utils.cookie_validators import backend, cookie, verifier

router = APIRouter()


# pylint: disable=too-many-arguments
@router.get("/navigate", name="web:register-navigation-user-action")
async def register_navigation_user_action(
    request: Request,
    background_tasks: BackgroundTasks,
    url: str,
    resource_id: str,
    resource_type: Literal[
        "service", "publication", "dataset", "training", "software", "data source"
    ],
    page_id: str,
    recommendation: bool = False,
    client: UserActionClient | None = Depends(user_actions_client),
):
    """Registers entering a URL and redirects to the URL"""
    response = RedirectResponse(status_code=303, url=url)
    if not client:
        return response

    try:
        session = (await verifier(request),)
    except HTTPException:
        session_id = uuid.uuid4()

        session = SessionData(
            username=None, aai_state=None, session_uuid=str(uuid.uuid4())
        )
        await backend.create(session_id, session)
        cookie.attach_to_response(response, session_id)

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
