"""Transform single or many records of a single type of data"""

from typing import Literal
from fastapi import APIRouter
from app.tasks.batch import transform_batch
from app.tasks.delete_data_by_id import delete_data_by_id

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
        "catalogue",
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
        task = delete_data_by_id.delay(data_type, data)
        return {"task_id": task.id}
    else:
        task = transform_batch.delay(data_type, data, full_update=False)
        return {"task_id": task.id}
