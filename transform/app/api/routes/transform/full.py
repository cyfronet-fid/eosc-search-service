import requests
from typing import Literal
from fastapi import APIRouter

from app.services.solr.delete import delete_data_by_type
from app.transform.utils.loader import (
    load_env_vars,
    ALL_COLLECTION,
    SERVICE,
    DATASOURCE,
    PROVIDER,
    OFFER,
    BUNDLE,
    GUIDELINE,
    TRAINING,
    MP_API_TOKEN,
    ADDRESS,
)
from app.worker import transform_batch

router = APIRouter()


@router.post("/full")
async def full_collection_update(
    data_type: Literal[
        "all",
        "service",
        "data source",
        "provider",
        "offer",
        "bundle",
        "interoperability guideline",
        "training",
    ],
):
    """Update a single whole collection or all collections besides OAG collections"""
    tasks_id = {
        SERVICE: None,
        DATASOURCE: None,
        PROVIDER: None,
        OFFER: None,
        BUNDLE: None,
        GUIDELINE: None,
        TRAINING: None,
    }

    if data_type == "all":
        # Update all collections
        for col in (SERVICE, DATASOURCE, PROVIDER, OFFER, BUNDLE, GUIDELINE, TRAINING):
            await update_single_col(col, tasks_id)
    else:
        # Update single collection
        await update_single_col(data_type, tasks_id)

    return tasks_id


async def update_single_col(data_type: str, tasks_id: dict) -> None:
    """Update whole, single collection"""
    env_vars = load_env_vars()
    data_address = env_vars[ALL_COLLECTION][data_type][ADDRESS]

    try:
        if data_type in (SERVICE, DATASOURCE, PROVIDER, OFFER, BUNDLE):
            headers = {
                "accept": "application/json",
                "X-User-Token": env_vars[MP_API_TOKEN],
            }
            data = requests.get(
                data_address,
                headers=headers,
                timeout=1000,
            ).json()
        else:
            # Trainings, guidelines
            data = requests.get(data_address, timeout=20).json()["results"]

        if data:
            # Clear current collection
            delete_data_by_type(data_type)
            # Transform & upload all resources
            update_task = transform_batch.delay(data_type, data)
            tasks_id[data_type] = update_task.id

    except Exception as e:
        return e
