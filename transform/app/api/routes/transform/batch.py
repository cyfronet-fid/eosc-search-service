"""Transform single or many records of a single type of data"""
from typing import Literal
from fastapi import APIRouter
from app.worker import transform_batch
from app.services.solr.delete import delete_data_by_id

router = APIRouter()


@router.post("/batch")
async def batch_update(
    data_type: Literal[
        "service",
        "data source",
        "provider",
        "offer",
        "bundle",
        "interoperability guideline",
        "training",
        "other",
        "software",
        "dataset",
        "publication",
    ],
    action: Literal[
        "update",
        "delete",
    ],
    data: dict | list[dict],
):
    """Transform a batch of a single type of data. Used for live update"""
    if action == "delete":
        delete_data_by_id(data_type, data)
    else:
        task = transform_batch.delay(data_type, data)
        return {"task_id": task.id}
