"""Handling live update for trainings and interoperability guidelines"""

import json
import logging

from app.services.solr.validate.endpoints.validate import check_document_exists
from app.settings import settings
from app.tasks.solr.delete_data_by_id import delete_data_by_id
from app.tasks.transform.batch import transform_batch

logger = logging.getLogger(__name__)


def process_message(frame) -> None:
    """
    Processes incoming JMS messages related to training resources and interoperability records.

    The function extracts relevant information from the message and performs actions based on the message
    content such as creating, updating, or deleting documents in the collection.

    Args:
        frame: The JMS message frame containing details like action type, data, and status.
    """
    action = frame.headers["destination"].split(".")[-1]
    raw_collection = frame.headers["destination"].split("/")[-1].split(".")[0]
    frame_body = json.loads(frame.body)

    active = frame_body["active"]
    suspended = frame_body["suspended"]
    status = frame_body["status"]

    collection, data, data_id = extract_data_from_frame(raw_collection, frame_body)

    logger.info(f"Started to process message, type: {raw_collection}, id: {data_id}")

    if action == "create":
        handle_create_action(active, suspended, status, collection, data, data_id)
    elif action == "update":
        handle_update_action(active, suspended, status, collection, data, data_id)
    elif action == "delete":
        handle_delete_action(collection, data_id, data)


def extract_data_from_frame(raw_collection, frame_body):
    """
    Extracts data and collection information from the frame body.

    Args:
        raw_collection (str): The collection type from the JMS message.
        frame_body (dict): The body of the JMS message containing the data.

    Returns:
        tuple: Returns a tuple containing collection, data, and data_id.
    """
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

    return collection, data, data_id


def handle_create_action(active, suspended, status, collection, data, data_id):
    """
    Handles the 'create' action for the JMS message.

    Args:
        active (bool): Flag indicating if the record is active.
        suspended (bool): Flag indicating if the record is suspended.
        status (str): The status of the record.
        collection (str): The name of the collection.
        data (dict): The data to be processed.
        data_id (str): The ID of the data.
    """
    if (
        active
        and not suspended
        and status in ["approved resource", "approved interoperability record"]
    ):
        logger.info(f"Creating action - {collection=}, ID: {data_id}")
        transform_batch.delay(collection, data, full_update=False)


def handle_update_action(active, suspended, status, collection, data, data_id):
    """
    Handles the 'update' action for the JMS message.

    Args:
        active (bool): Flag indicating if the record is active.
        suspended (bool): Flag indicating if the record is suspended.
        status (str): The status of the record.
        collection (str): The name of the collection.
        data (dict): The data to be processed.
        data_id (str): The ID of the data.
    """
    if (
        active
        and not suspended
        and status in ["approved resource", "approved interoperability record"]
    ):
        logger.info(f"Update action - {collection=}, ID: {data_id}")
        transform_batch.delay(collection, data, full_update=False)
    else:
        if check_document_exists(collection, data_id):
            logger.info(f"Delete action - {collection=}, ID: {data_id}")
            delete_data_by_id.delay(collection, data, delete=True)


def handle_delete_action(collection, data_id, data):
    """
    Handles the 'delete' action for the JMS message.

    Args:
        collection (str): The name of the collection.
        data_id (str): The ID of the data to be deleted.
        data (dict): The data to be deleted.
    """
    if check_document_exists(collection, data_id):
        logger.info(f"Delete action - {collection=}, ID: {data_id}")
        delete_data_by_id.delay(collection, data, delete=True)
