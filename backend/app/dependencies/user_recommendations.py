# pylint: disable=missing-module-docstring, missing-class-docstring, missing-function-docstring
import datetime
import json
import logging
from typing import Optional, Union

import stomp
from stomp.exception import ConnectFailedException

from app.schemas.session_data import SessionData
from app.settings import settings

logger = logging.getLogger(__name__)


class UserActionRecommendationClient:
    # pylint: disable=too-many-arguments
    def __init__(
        self, host: str, port: int, username: str, password: str, topic: str, ssl: bool
    ):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.topic = topic
        self.ssl = ssl
        hosts_and_ports = [(self.host, self.port)]
        self.client = stomp.Connection(host_and_ports=hosts_and_ports)
        if self.ssl:
            self.client.set_ssl(hosts_and_ports)

    def connect(self) -> None:
        self.client.connect(self.username, self.password, wait=True)

    # pylint: disable=too-many-arguments
    def send(
        self,
        session: SessionData,
        reason: list[str],
        suggestion: str,
        action: str,
        visit_id: str,
        resource_id: Union[str, int],
        resource_type: str,
    ) -> None:
        # this hack is required for legacy purposes.
        message = json.dumps(
            self._make_user_action(
                session.aai_id,
                session.session_uuid,
                reason,
                suggestion,
                action,
                visit_id,
                resource_id,
                resource_type,
            )
        )

        self.client.send(
            self.topic,
            message,
            content_type="application/json",
        )
        self.client.disconnect()

    # pylint: disable=too-many-arguments
    def _make_user_action(
        self,
        aai_uid: Optional[str],
        session_uuid: str,
        reason: list[str],
        suggestion: str,
        action: str,
        visit_id: str,
        resource_id: Union[str, int],
        resource_type: str,
    ) -> dict:
        user_action = {
            "unique_id": session_uuid,
            "client_id": "user_dashboard",
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "source": {
                "action": action,
                "reason": reason,
                "suggestion": suggestion,
                "session_uuid": session_uuid,
                "visit_id": visit_id,
                "resource_id": resource_id,
                "resource_type": resource_type,
            },
            "target": {"visit_id": visit_id},
            "action": {"type": "recommendation evaluation"},
        }

        if aai_uid:
            user_action["aai_uid"] = aai_uid

        return user_action


def user_actions_client() -> UserActionRecommendationClient | None:
    client = UserActionRecommendationClient(
        settings.STOMP_HOST,
        settings.STOMP_PORT,
        settings.STOMP_LOGIN,
        settings.STOMP_PASS,
        settings.STOMP_RECOMMENDATIONS_TOPIC,
        settings.STOMP_SSL,
    )
    try:
        client.connect()
        return client
    except ConnectFailedException:
        logger.exception("Could not instantiate mqtt client")
        return None


# pylint: disable=too-many-arguments
def send_user_action_bg_task(
    client: UserActionRecommendationClient,
    session: SessionData,
    reason: list[str],
    suggestion: str,
    action: str,
    visit_id: str,
    resource_id: Union[str, int],
    resource_type: str,
):
    client.send(
        session, reason, suggestion, action, visit_id, resource_id, resource_type
    )
