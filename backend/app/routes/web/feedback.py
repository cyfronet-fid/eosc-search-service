"""The feedback ticket endpoint"""
import logging

from fastapi import APIRouter, HTTPException
from httpx import AsyncClient
from pydantic import BaseModel

from app.settings import settings

router = APIRouter()

logger = logging.getLogger(__name__)


class FeedbackModel(BaseModel):
    """Feedback data"""

    name: str
    email: str
    subject: str
    message: str


headers = {
    "Content-Type": "application/json",
    "Authorization": f"Token token={settings.FEEDBACK_CLIENT_SECRET}",
}


@router.post("/feedback", name="web:post-feedback")
async def create_ticket(feedback_data: FeedbackModel):
    """
    Create a ticket in dedicated ticket-system (currently Zammad)
    """

    ticket_data = {
        "title": feedback_data.subject,
        "group": "EOSC 1st line support",
        "customer": "a.pulapa@cyfronet.pl",
        "article": {
            "subject": feedback_data.subject,
            "body": (
                f"{feedback_data.message} \n"
                f"Customer name: {feedback_data.name} \n"
                f"Customer e-mail: {feedback_data.email}"
            ),
            "type": "note",
            "internal": False,
        },
    }

    async with AsyncClient() as async_client:
        response = await async_client.post(
            settings.ZAMMAD_INSTANCE_URL, json=ticket_data, headers=headers
        )

        if response.status_code == 200:
            return {"message": "Feedback submitted successfully"}

        raise HTTPException(status_code=response.status_code)
