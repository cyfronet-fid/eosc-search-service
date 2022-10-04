"""UserActions-specific dependencies"""
import datetime
import json
import uuid
from functools import lru_cache
from typing import Optional, Union

import stomp

from app.config import (
    USER_ACTIONS_QUEUE_HOST,
    USER_ACTIONS_QUEUE_PASSWORD,
    USER_ACTIONS_QUEUE_PORT,
    USER_ACTIONS_QUEUE_TOPIC,
    USER_ACTIONS_QUEUE_USERNAME,
)
from app.schemas.session_data import SessionData


class UserActionClient:
    """Wrapper for the STOMP client which sends valid user action to the databus"""

    # pylint: disable=too-many-arguments
    def __init__(self, host: str, port: int, username: str, password: str, topic: str):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.topic = topic
        self.client = stomp.Connection(
            host_and_ports=[(USER_ACTIONS_QUEUE_HOST, USER_ACTIONS_QUEUE_PORT)]
        )

    def connect(self) -> None:
        """Connect stomp internal client, this function must be called before using `send`
        """
        self.client.connect(
            USER_ACTIONS_QUEUE_USERNAME, USER_ACTIONS_QUEUE_PASSWORD, wait=True
        )

    # pylint: disable=too-many-arguments
    def send(
        self,
        session: SessionData,
        url: str,
        page_id: str,
        resource_id: Union[str, int],
        resource_type: str,
        recommendation: bool,
    ) -> None:
        """Send user data to databus. Ensure that `.connect()` method has been called before.
        """

        self.client.send(
            self.topic,
            json.dumps(
                self._make_user_action(
                    session.aai_state,
                    url,
                    session.session_uuid,
                    resource_id,
                    resource_type,
                    page_id,
                    recommendation,
                )
            ),
            content_type="application/json",
        )

    # pylint: disable=too-many-arguments
    def _make_user_action(
        self,
        aai_uid: Optional[str],
        url: str,
        session_uuid: str,
        resource_id: Union[str, int],
        resource_type: str,
        page_id: str,
        recommendation: bool,
    ) -> dict:
        """Create valid user action json dict"""

        user_action = {
            "unique_id": session_uuid,
            "client_id": "search_service",
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "source": {
                "visit_id": session_uuid,
                # "search/data", "search/publications", "search/software",
                # "search/services", "search/trainings", - user dashboard - "dashboard"
                "page_id": page_id,
                "root": {
                    "type": "recommendation_panel",  # "other" - from normal list
                    "panel_id": "v1",
                    "resource_id": resource_id,  # id of the clicked resource
                    # publication, dataset, software, service, training
                    "resource_type": resource_type,
                }
                if recommendation
                else {
                    "type": "other",
                    "resource_id": resource_id,
                    "resource_type": resource_type,
                },
            },
            "target": {"visit_id": str(uuid.uuid4()), "page_id": url},
            "action": {"type": "browser action", "text": "", "order": False},
        }

        if aai_uid:
            user_action["aai_uid"] = aai_uid

        return user_action


@lru_cache()
def user_actions_client():
    """User actions databus client dependency"""

    client = UserActionClient(
        USER_ACTIONS_QUEUE_HOST,
        USER_ACTIONS_QUEUE_PORT,
        USER_ACTIONS_QUEUE_USERNAME,
        USER_ACTIONS_QUEUE_PASSWORD,
        USER_ACTIONS_QUEUE_TOPIC,
    )
    client.connect()
    return client


# pylint: disable=too-many-arguments
def send_user_action_bg_task(
    client: UserActionClient,
    session: SessionData,
    url: str,
    page_id: str,
    resource_id: str,
    resource_type: str,
    recommendation: bool,
):
    """Simple wrapper function which can be used 'as is' in fastapi's BackgroundTask"""
    client.send(session, url, page_id, resource_id, resource_type, recommendation)