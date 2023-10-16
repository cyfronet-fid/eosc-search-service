# pylint: disable=invalid-name, logging-fstring-interpolation
"""Celery worker. Responsibilities: get, transform, upload data"""
import os
import json
import logging
from celery import Celery
import app.transform.transformers as trans
from app.transform.utils.loader import (
    ALL_COLLECTION,
    GUIDELINE,
    OUTPUT_SCHEMA,
    load_env_vars,
    load_request_data,
)

from app.transform.utils.validate import (
    check_schema_after_trans,
)
from app.transform.utils.send import send_json_string_to_solr
from app.services.spark.config import apply_spark_conf


logger = logging.getLogger(__name__)
celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get(
    "CELERY_RESULT_BACKEND", "redis://localhost:6379"
)


@celery.task(name="transform_batch")
def transform_batch(type_: str, data: dict | list[dict]) -> None:
    """Celery task for transforming batch data"""
    transformer = trans.transformers.get(type_)
    env_vars = load_env_vars()

    if not transformer:
        logger.error(f"No data transformer is provided for {type_}")
        return None

    spark = None

    # Transform
    if type_ == GUIDELINE:
        df_trans = transformer(data)
    else:
        spark, _ = apply_spark_conf()
        df = load_request_data(spark, data)
        df_trans = transformer(spark)(df)
        try:
            check_schema_after_trans(
                df_trans,
                env_vars[ALL_COLLECTION][type_][OUTPUT_SCHEMA],
                collection=type_,
            )
        except AssertionError:
            logger.error(
                f"Schema validation after transformation failed for type={type_}"
            )

    if type_ == GUIDELINE:
        output = df_trans.to_json(orient="records")
    else:
        output_list = (
            df_trans.toJSON().map(lambda str_json: json.loads(str_json)).collect()
        )
        output = json.dumps(output_list)

    send_json_string_to_solr(output, env_vars, type_)

    if spark:
        spark.sparkContext.stop()
