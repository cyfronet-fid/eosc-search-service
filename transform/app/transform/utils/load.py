import json
from logging import getLogger

from pyspark.sql import DataFrame, SparkSession

from app.services.solr.validate.schema.validate import validate_schema

logger = getLogger(__name__)


def load_file_data(spark: SparkSession, data_path: str, _format: str = "json"):
    """Load data based on the provided data path"""
    return spark.read.format(_format).load(data_path)


def load_request_data(
    spark: SparkSession, data: dict | list[dict], input_exp_sch: dict, type_: str
) -> DataFrame:
    """Load input data into pyspark dataframe, validate its schema"""
    df = spark.read.json(spark.sparkContext.parallelize([json.dumps(data)]))
    try:  # Check raw, input schema
        validate_schema(
            df,
            input_exp_sch,
            collection=type_,
            source="input",
        )
    except AssertionError:
        logger.warning(
            f"Schema validation of raw input data for type={type_} has failed. Input schema is different than excepted"
        )
    return df
