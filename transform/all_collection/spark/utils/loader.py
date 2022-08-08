"""Load data"""
from typing import Dict
from pyspark.sql import SparkSession
from pyspark.sql.utils import AnalysisException

from transform.all_collection.spark.schemas.starting_schemas import (
    ds_software_schema,
    publication_schema,
)
from transform.all_collection.spark.utils.load_env_vars import (
    DATASET_PATH,
    PUBLICATION_PATH,
    SOFTWARE_PATH,
    TRAININGS_PATH,
    SERVICES_PATH,
    DATASETS,
    PUBLICATIONS,
    SOFTWARE,
    TRAININGS,
    SERVICES,
)


def load_data(spark: SparkSession, data_paths: Dict, _format: str = "json"):
    """Load data based on the spark session and provided data paths"""
    datasets = (
        spark.read.format(_format)
        .schema(ds_software_schema)
        .load(data_paths[DATASET_PATH])
    )
    publications = (
        spark.read.format(_format)
        .schema(publication_schema)
        .load(data_paths[PUBLICATION_PATH])
    )
    software = (
        spark.read.format(_format)
        .schema(ds_software_schema)
        .load(data_paths[SOFTWARE_PATH])
    )
    trainings = (
        spark.read.format(_format)
        .option("multiline", True)
        .load(data_paths[TRAININGS_PATH])
    )
    try:
        services = (
            spark.read.format(_format)
            .option("multiline", True)
            .load(data_paths[SERVICES_PATH])
        )
    except AnalysisException:
        services = None

    loaded_data = {
        DATASETS: datasets,
        PUBLICATIONS: publications,
        SOFTWARE: software,
        TRAININGS: trainings,
        SERVICES: services,
    }

    return loaded_data
