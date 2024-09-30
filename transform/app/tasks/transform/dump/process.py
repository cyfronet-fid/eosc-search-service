"""Main celery task for managing of processing a dump of data"""

import logging
from datetime import datetime
from typing import Optional

from celery import chain
from celery.result import AsyncResult

from app.api.schemas.transform.dump import DumpUpdateRequest
from app.services.celery.task import CeleryTaskStatus
from app.tasks.solr.create_collections import create_solr_collections_task
from app.tasks.transform.dump.load import load_dump
from app.tasks.transform.dump.transform import transform_data
from app.tasks.transform.dump.validate import validate_dump
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="update_peripheral_data")
def update_peripheral_data(
    prev_task_status: Optional[CeleryTaskStatus], req_body: dict
) -> dict:
    """Task to update peripheral data."""
    logger.info("Updating peripheral data...")
    # Invoke send task

    return CeleryTaskStatus(status="toBeImplemented").dict()


@celery.task(name="transform_dump")
def process_dump(req_body: dict) -> AsyncResult:
    """Main celery task for managing of processing a dump of data.
    Workflow:
        1) Validate dump
        2)* Create solr collections - optional
        3) Load files
        4) Transform and send to solr/s3
        5) Make a full update of peripheral data to solr/s3

    Args:
        req_body (DumpUpdateRequest): request body.
    """
    logger.info(f"Transforming data dump has started. Details={req_body}")
    workflow = create_workflow(req_body)
    result = workflow.apply_async()

    return result


def create_workflow(req_body: dict) -> chain:
    """Construct a proper celery workflow for given needs"""
    instances = req_body.get("instances", [])
    workflow = chain(
        validate_dump.s(None, req_body["dump_url"]),
        load_dump.s(req_body["dump_url"]),
    )  # Validate task, no previous status

    # Create solr collections for each solr instance task

    for instance in instances:
        if instance["type"] == "solr":
            solr_task_params = {
                "solr_url": instance["url"],
                "all_collection_config": instance["all_col_conf"],
                "catalogue_config": instance["cat_conf"],
                "organisation_config": instance["org_conf"],
                "project_config": instance["proj_conf"],
                "provider_config": instance["provider_conf"],
                "collection_prefix": instance["cols_prefix"],
                "date": datetime.now().strftime("%Y%m%d"),
                "num_shards": instance["num_shards"],
                "replication_factor": instance["replication_factor"],
            }
            logger.info(f"Adding solr collection task with params: {solr_task_params}")
            workflow |= create_solr_collections_task.s(**solr_task_params)

    # Add the remaining tasks
    workflow |= transform_data.s()

    # workflow |= update_peripheral_data.s(req_body)

    return workflow
