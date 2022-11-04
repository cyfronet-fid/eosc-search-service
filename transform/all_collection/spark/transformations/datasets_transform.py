# pylint: disable=wildcard-import, unused-wildcard-import
"""Transform datasets"""

from pyspark.sql import SparkSession
from pyspark.sql.types import StructType
from pyspark.sql.functions import lit
from transform.all_collection.spark.transformations.commons import *
from transform.all_collection.spark.utils.join_dfs import create_df, join_different_dfs
from transform.all_collection.spark.utils.utils import drop_columns, add_columns
from transform.all_collection.spark.schemas.input_col_name import (
    UNIQUE_SERVICE_COLUMNS,
    UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
)
from transform.all_collection.spark.utils.utils import replace_empty_str


__all__ = ["transform_datasets"]
DATASET_TYPE_VALUE = "dataset"

COLS_TO_ADD = (
    *UNIQUE_SERVICE_COLUMNS,
    *UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
    "documentation_url",
    "fos",
    "programming_language",
    "subtitle",
    "content_type",
    "duration",
    "eosc_provider",
    "format",
    "horizontal",
    "pid",
    "level_of_expertise",
    "license",
    "qualification",
    "resource_type",
    "target_group",
)
COLS_TO_DROP = (
    "affiliation",
    "author",
    "context",
    "contributor",
    "country",
    "coverage",
    "dateofcollection",
    "embargoenddate",
    "eoscIF",
    "geolocation",
    "format",
    "indicator",
    "instance",
    "lastupdatetimestamp",
    "originalId",
    "projects",
    "pid",
    "subject",
)


def transform_datasets(
    datasets: DataFrame, harvested_schema: StructType, spark: SparkSession
) -> DataFrame:
    """Transform datasets"""
    harvested_properties = {}

    datasets = datasets.withColumn(TYPE, lit(DATASET_TYPE_VALUE))
    check_type(datasets, desired_type=DATASET_TYPE_VALUE)
    datasets = rename_oag_columns(datasets)
    datasets = map_best_access_right(datasets, harvested_properties, DATASET_TYPE_VALUE)
    create_open_access(harvested_properties[BEST_ACCESS_RIGHT], harvested_properties)
    datasets = simplify_language(datasets)
    datasets = simplify_indicators(datasets)
    datasets = map_publisher(datasets)

    harvest_author_names_and_pids(datasets, harvested_properties)
    harvest_sdg_and_fos(datasets, harvested_properties)
    harvest_funder(datasets, harvested_properties)
    harvest_url_and_document_type(datasets, harvested_properties)
    harvest_doi(datasets, harvested_properties)
    harvest_country(datasets, harvested_properties)
    harvest_research_community(datasets, harvested_properties)
    create_unified_categories(datasets, harvested_properties)

    datasets = drop_columns(datasets, COLS_TO_DROP)
    harvested_df = create_df(harvested_properties, harvested_schema, spark)
    datasets = join_different_dfs((datasets, harvested_df))
    datasets = add_columns(datasets, COLS_TO_ADD)
    datasets = cast_oag_columns(datasets)
    datasets = replace_empty_str(datasets)
    datasets = datasets.select(sorted(datasets.columns))

    return datasets
