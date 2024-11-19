"""Main celery task for managing of processing a dump of data"""

import logging
from datetime import datetime
from typing import Optional

from celery import chain
from celery.result import AsyncResult

from app.api.schemas.transform.dump import DumpUpdateRequest
from app.services.celery.task import CeleryTaskStatus
from app.services.solr.collections import (
    COL_UPLOAD_CONFIG,
    get_collection_names,
    get_solr_upload_config,
    get_uniq_solr_col_names,
)
from app.tasks.solr.create_collections import create_solr_collections_task
from app.tasks.transform.dump.load import load_dump
from app.tasks.transform.dump.transform import transform_data
from app.tasks.transform.dump.validate import validate_dump
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="update_peripheral_data")
def update_peripheral_data(prev_task_status: Optional[dict], req_body: dict) -> dict:
    """Task to update peripheral data."""
    logger.info("Updating peripheral data...")
    # Invoke send task

    return CeleryTaskStatus(status="toBeImplemented").dict()


@celery.task(name="transform_dump")
def process_dump(req_body: dict) -> AsyncResult:
    """Main celery task for managing of processing a dump of data.
        1) Verify the input dump data (access, dump structure, data types, schemas).
        2) (Optional) create new solr collections or use already existing ones.
        3) Load data from a cloud (S3 bucket).
        4) Merge input data files if number of records are below `records_threshold`.
        5) Transform input data synchronously.
        6) Sent output data to solr/s3 synchronously.
        7) Call `full` endpoint (with `data_type=all`) to get the rest data types into solr/s3.

    Args:
        req_body (DumpUpdateRequest): request body.
    """
    logger.info(f"Transforming data dump has started. Details={req_body}")
    workflow = create_workflow(req_body)
    result = workflow.apply_async()

    return result


def create_workflow(req_body: dict) -> chain:
    """Construct a proper celery workflow for given needs"""

    workflow = chain(
        validate_dump.s(None, req_body),
        load_dump.s(req_body["dump_url"]),
    )  # Validate, load

    # Optional create solr collections, or use already existing ones
    workflow = solr_cols_subtask(workflow, req_body)

    # Transform
    workflow |= transform_data.s(req_body)

    # workflow |= update_peripheral_data.s(req_body)  # TODO

    return workflow


def solr_cols_subtask(wf: chain, req_body: dict) -> chain:
    """
    - Get solr upload configuration for a single data iteration based on specified instance prefix.
    -- Create new solr collections for entire data iteration,
    -- OR if cols with `cols_prefix` already exist, use them.
    """
    instances = req_body.get("instances", [])

    for instance in instances:
        if instance["type"] == "solr":
            # Consider setting the upload collection config in the request body
            instance[COL_UPLOAD_CONFIG] = get_solr_upload_config(
                instance["cols_prefix"]
            )

            requested_cols = get_uniq_solr_col_names(instance["cols_prefix"])
            existing_cols = get_collection_names(instance["url"])

            if not any(col in existing_cols for col in requested_cols):
                # Create new solr collections
                solr_task_params = {
                    "solr_url": instance["url"],
                    "all_collection_config": instance["all_col_conf"],
                    "catalogue_config": instance["cat_conf"],
                    "organisation_config": instance["org_conf"],
                    "project_config": instance["proj_conf"],
                    "provider_config": instance["provider_conf"],
                    "collection_prefix": instance["cols_prefix"],
                    "num_shards": instance["num_shards"],
                    "replication_factor": instance["replication_factor"],
                }

                logger.info(
                    f"Creating solr collections with params: {solr_task_params}"
                )
                wf |= create_solr_collections_task.s(**solr_task_params)

    return wf
