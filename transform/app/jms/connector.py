import json
import logging
import ssl
import stomp
from stomp.exception import ConnectFailedException
import time
from typing import Callable, Optional

from app.services.solr.validate import check_document_exists
from app.tasks.delete_data_by_id import delete_data_by_id
from app.tasks.batch import transform_batch
from app.settings import settings

logger = logging.getLogger(__name__)


class ProviderListener(stomp.ConnectionListener):
    """"""

    def on_error(self, frame):
        logger.error("received an error '%s'", frame.body)

    def on_message(self, frame):
        action = frame.headers["destination"].split(".")[-1]
        raw_collection = frame.headers["destination"].split("/")[-1].split(".")[0]
        frame_body = json.loads(frame.body)
        active = frame_body["active"]
        suspended = frame_body["suspended"]
        status = frame_body["status"]

        if raw_collection == "training_resource":
            collection = settings.TRAINING
            data = frame_body["trainingResource"]
            data_id = data["id"]
        elif raw_collection == "interoperability_record":
            collection = settings.GUIDELINE
            data = [frame_body["interoperabilityRecord"]]
            data_id = data[0]["id"]
        else:
            collection = raw_collection
            data = None
            data_id = None

        if action == "create":
            if (
                active
                and not suspended
                and status in ["approved resource", "approved interoperability record"]
            ):
                transform_batch.delay(collection, data, full_update=False)
        elif action == "update":
            if (
                active
                and not suspended
                and status in ["approved resource", "approved interoperability record"]
            ):
                transform_batch.delay(collection, data, full_update=False)
            else:
                if check_document_exists(collection, data_id):
                    delete_data_by_id.delay(collection, data)

        elif action == "delete":
            if check_document_exists(collection, data_id):
                delete_data_by_id.delay(collection, data)


def default_subscription_condition(connection: stomp.Connection) -> bool:
    """"""
    return connection.is_connected()


# pylint: disable=too-many-arguments
def subscribe_to_queue(
    host: str,
    port: int,
    username: str,
    password: str,
    topic: str,
    subscription_id: str,
    _ssl: bool = True,
    _logger: Optional[logging.Logger] = None,
    subscription_condition: Optional[Callable] = default_subscription_condition,
) -> None:
    """"""
    if _logger is None:
        _logger = logging.getLogger(__name__)

    connection = stomp.Connection([(host, port)])

    if _ssl:
        _logger.info("SSL is enabled for STOMP connection.")
        connection.set_ssl(for_hosts=[(host, port)], ssl_version=ssl.PROTOCOL_TLS)
    else:
        _logger.info("SSL is disabled for STOMP connection.")

    connection.set_listener("", ProviderListener())

    try:
        connection.connect(username=username, password=password, wait=True, ssl=_ssl)
        connection.subscribe(destination=topic, id=subscription_id, ack="auto")
        _logger.info(
            "Subscribed to %(topic)s on %(host)s:%(port)s",
            {"topic": topic, "host": host, "port": port},
        )

        while subscription_condition(connection):
            time.sleep(1.0)
    except ConnectFailedException:
        _logger.critical("Could not subscribe (check host / credentials)")
    except KeyboardInterrupt:
        connection.disconnect()
