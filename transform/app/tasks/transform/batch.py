"""A task for transforming a batch of data and sending it to solr"""

import json
import logging
from typing import Optional

import app.transform.transformers as trans
from app.services.celery.task import CeleryTaskStatus
from app.services.solr.delete import delete_data_by_type
from app.services.spark.config import apply_spark_conf
from app.settings import settings
from app.transform.utils.load import load_request_data
from app.transform.utils.send import send_json_string_to_solr
from app.worker import celery

logger = logging.getLogger(__name__)


@celery.task(name="transform_batch")
def transform_batch(
    prev_task_status: Optional[CeleryTaskStatus],
    type_: str,
    data: dict | list[dict],
    full_update=True,
) -> dict | None:
    """Celery task for transforming batch data

    Args:
        type_ (str): Data type
        data (dict): Data
        full_update (bool): Is it a full collection update?
    """
    logger.info(f"{type_} data update has started, {full_update=}")
    transformer = trans.transformers.get(type_)

    if not transformer:
        logger.error(f"No data transformer is provided for {type_}")
        return {
            "status": "failure",
            "error": f"No data transformer is provided for {type_}",
        }

    # Transform
    try:
        if type_ == settings.GUIDELINE:  # Pandas
            df_trans = transformer(data)
        else:  # Pyspark
            spark, _ = apply_spark_conf()
            input_schema = settings.COLLECTIONS[type_]["INPUT_SCHEMA"]
            df = load_request_data(spark, data, input_schema, type_)
            df_trans = transformer(spark)(df)

        # df -> json
        if type_ == settings.GUIDELINE:
            output = df_trans.to_json(orient="records")
        else:
            output_list = (
                df_trans.toJSON().map(lambda str_json: json.loads(str_json)).collect()
            )
            output = json.dumps(output_list)

        if full_update:
            # Delete all resources of a certain type only if that is a full collection update
            delete_data_by_type(type_)
        send_json_string_to_solr(output, type_)  # Upload data to those collections

        logger.info(f"{type_} data update has been successful")
        return CeleryTaskStatus(status="success").dict()

    except Exception as e:
        logger.error(f"{type_} data update has failed, error message: {e}")
        return CeleryTaskStatus(status="failure", reason=str(e)).dict()
