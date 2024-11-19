from app.services.solr.validate.endpoints.validate import check_document_exists
from app.settings import settings
from app.tasks.solr.delete_data_by_id import delete_data_by_id
from app.tasks.transform.batch import transform_batch
from schemas.properties.data import ID


def update_data_item(data: dict, data_type: str, linked_data_type: str) -> dict:
    """
    Generic function to update data items and delete linked items if necessary.

    Args:
        data (dict): The data to be updated.
        data_type (str): The type of the data being updated.
        linked_data_type (str): The type of the data linked to the main data, which may need deletion.

    Returns:
        list: A list of Celery task IDs.
    """
    tasks = {}
    if check_document_exists(linked_data_type, data[ID]):
        delete_task = delete_data_by_id.delay(linked_data_type, data, delete=True)
        tasks["delete"] = delete_task.id

    update_task = transform_batch.delay(data_type, data, full_update=False)
    tasks["update"] = update_task.id

    return tasks


def update_data_source(data: dict) -> dict:
    """Updates a data source and conditionally deletes related service data if needed."""
    return update_data_item(data, settings.DATASOURCE, settings.SERVICE)


def update_service(data: dict) -> dict:
    """Updates a service and conditionally deletes related data source data if needed."""
    return update_data_item(data, settings.SERVICE, settings.DATASOURCE)
