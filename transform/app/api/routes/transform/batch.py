"""Transform single or many records of a single type of data"""

from typing import Literal

from fastapi import APIRouter

from app.tasks.batch import transform_batch
from app.tasks.delete_data_by_id import delete_data_by_id
from app.transform.live_update.data_type_handlers import (update_data_source,
                                                          update_service)

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
) -> dict:
    """Transform a batch of a single type of data. Used for live update"""
    tasks = {}
    if action == "delete":
        task = delete_data_by_id.delay(data_type, data, delete=True)
        tasks["delete"] = task.id
    else:
        if data_type == "service":
            task_ids = update_service(data)
        elif data_type == "data source":
            task_ids = update_data_source(data)
        else:
            task = transform_batch.delay(data_type, data, full_update=False)
            task_ids = {"update": task.id}

        tasks.update(task_ids)

    return {"tasks": tasks}
