# pylint: disable=line-too-long
"""Endpoint for full collection update"""
from typing import Literal

from fastapi import APIRouter

from app.services.mp_pc.data import get_data
from app.settings import settings
from app.tasks.transform.batch import transform_batch

router = APIRouter()


@router.post("/full")
async def full_update(
    data_type: Literal[
        "all",
        "service",
        "data source",
        "provider",
        "offer",
        "bundle",
        "interoperability guideline",
        "training",
        "catalogue",
    ],
) -> dict[str, str | None]:
    """Perform a full update of data collection/collections"""
    tasks_ids = {
        settings.SERVICE: None,
        settings.DATASOURCE: None,
        settings.PROVIDER: None,
        settings.OFFER: None,
        settings.BUNDLE: None,
        settings.GUIDELINE: None,
        settings.TRAINING: None,
        settings.CATALOGUE: None,
    }

    if data_type == "all":
        # Update all collections
        for col in (
            settings.SERVICE,
            settings.DATASOURCE,
            settings.PROVIDER,
            settings.OFFER,
            settings.BUNDLE,
            settings.GUIDELINE,
            settings.TRAINING,
            settings.CATALOGUE,
        ):
            await update_single_col(col, tasks_ids)
    else:
        # Update single collection
        await update_single_col(data_type, tasks_ids)

    return tasks_ids


async def update_single_col(data_type: str, tasks_id: dict) -> None:
    """Update whole, single collection"""
    data_address = settings.COLLECTIONS[data_type]["ADDRESS"]

    data = await get_data(data_type, data_address)

    if data:
        # Get data, transform data, delete current data of the same type, upload data
        update_task = transform_batch.delay(data_type, data, full_update=True)
        tasks_id[data_type] = update_task.id
    else:
        tasks_id[data_type] = (
            f"Retrieving data from {data_address} has failed. Please try again. Checks logs for details."
        )
