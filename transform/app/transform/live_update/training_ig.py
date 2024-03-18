"""Handling live update for trainings and interoperability guidelines"""

import json
import logging

from app.services.solr.validate import check_document_exists
from app.settings import settings
from app.tasks.batch import transform_batch
from app.tasks.delete_data_by_id import delete_data_by_id

logging.basicConfig(filename="app/logs/celery.log", level=logging.INFO)
logger = logging.getLogger(__name__)


def process_message(frame) -> None:
    """Process messages from a JMS"""
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

    logger.info(f"Received message, type: {raw_collection}, id: {data_id}")

    if action == "create":
        if (
            active
            and not suspended
            and status in ["approved resource", "approved interoperability record"]
        ):
            logger.info(f"Create action - type: {raw_collection}, id: {data_id}")
            transform_batch.delay(collection, data, full_update=False)
    elif action == "update":
        if (
            active
            and not suspended
            and status in ["approved resource", "approved interoperability record"]
        ):
            logger.info(f"Update action - type: {raw_collection}, id: {data_id}")
            transform_batch.delay(collection, data, full_update=False)
        else:
            if check_document_exists(collection, data_id):
                logger.info(f"Delete action - type: {raw_collection}, id: {data_id}")
                delete_data_by_id.delay(collection, data)

    elif action == "delete":
        if check_document_exists(collection, data_id):
            logger.info(f"Delete action - type: {raw_collection}, id: {data_id}")
            delete_data_by_id.delay(collection, data)
