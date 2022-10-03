# pylint: disable=missing-module-docstring
from fastapi import APIRouter
from starlette.responses import RedirectResponse

router = APIRouter()


@router.get("/navigate", name="web:navigate")
async def register_navigation_user_action(url: str):
    """Registers entering a URL and redirects to the URL"""
    return RedirectResponse(status_code=303, url=url)
    # send user action via activemq via background task
