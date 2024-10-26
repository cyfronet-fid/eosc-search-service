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
        2) (Optional) create new solr collections or use already existing ones.
        3) Load data from a cloud (S3 bucket).
        4) Merge input data files if number of records are below `records_threshold`.
        5) Transform input data synchronously.
        6) Sent output data to solr/s3 synchronously.
        7) Call `full` endpoint (with `data_type=all`) to get the rest data types into solr/s3.

    NOTE:
        - IMPORTANT: (`cols_prefix` in solr instance)
            - If you want to create new collections - specify UNIQUE `cols_prefix: oag<ver>_YYYYMMDD_`,
            - If you want to add data to already existing collections - specify already EXISTING `cols_prefix: oag<ver>_YYYYMMDD_`
        - Consider removing the oldest iteration of data from solr/s3 before creating a new one.
        - Data iteration created by this endpoint is not used anywhere by default. Set aliases in solr to use the data.
    """
    req_body_dict = req_body.dict_for_celery()
    task = process_dump.delay(req_body_dict)

    return {"task_id": task.id}
