# pylint: disable=missing-function-docstring

""" Events UI endpoint """

import httpx
from fastapi import APIRouter

from app.settings import settings

router = APIRouter()


@router.get("/{event_date}")
async def get_events(event_date: str):
    url = f"{settings.EOSC_EVENTS_API}"
    url += f"{event_date}"
    events = any

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        resp.raise_for_status()
        events = resp.json()

    return events
