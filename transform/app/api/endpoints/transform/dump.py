"""Endpoint for performing a dump update"""

from fastapi import APIRouter

from app.api.schemas.transform.dump import DumpUpdateRequest
from app.tasks.transform.dump.process import process_dump

router = APIRouter()


@router.post("/dump")
async def dump_update(req_body: DumpUpdateRequest) -> dict[str, str | None]:
    """Perform a dump update to create a single data iteration.

    Endpoint workflow:
    1) Verify the input dump data (access, dump structure, data types, schemas).
    2) (Optional only if in `instances.type=solr` is specified) Create empty collections for a single data iteration in solr instances.
    3) Load data from a cloud (S3 bucket).
    4) Transform and upload the input dump data into solr/s3.
    5) Call `full` endpoint (with `data_type=all`) to get the rest data types into solr/s3.

    Assumptions:
    - The input dump data is unpacked - json format is expected.
    - The output data on S3 will be unpacked also - json format.
    - The oldest iteration of data from solr/s3 should be deleted manually before calling this endpoint.
    - Data iteration created by this endpoint is not used anywhere by default. Set aliases in solr to use the data.
    """
    req_body_dict = req_body.dict_for_celery()
    task = process_dump.delay(req_body_dict)

    return {"task_id": task.id}
