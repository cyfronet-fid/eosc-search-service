# pylint: disable=wildcard-import, unused-wildcard-import
"""Transform datasets"""

from pyspark.sql import SparkSession
from pyspark.sql.types import StructType
from transform.all_collection.spark.transformations.commons import *
from transform.all_collection.spark.utils.join_dfs import create_df, join_different_dfs
from transform.all_collection.spark.utils.utils import drop_columns, add_columns
from transform.all_collection.spark.schemas.input_col_name import (
    SDG,
    UNIQUE_SERVICE_COLUMNS,
)
from transform.all_collection.spark.utils.utils import replace_empty_str


__all__ = ["transform_datasets"]

COLS_TO_ADD = (
    *UNIQUE_SERVICE_COLUMNS,
    "code_repository_url",
    "documentation_url",
    "fos",
    "programming_language",
    "subtitle",
    "content_type",
    "duration",
    "eosc_provider",
    "format",
    "pid",
    "level_of_expertise",
    "license",
    "qualification",
    "resource_type",
    "target_group",
)
COLS_TO_DROP = (
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
    col_name = "dataset"
    harvested_properties = {}

    check_type(datasets, desired_type=col_name)
    datasets = rename_oag_columns(datasets)
    datasets = harvest_best_access_right(datasets, harvested_properties, col_name)
    create_open_access(harvested_properties[BEST_ACCESS_RIGHT], harvested_properties)
    datasets = simplify_language(datasets)

    harvest_author_names_and_pids(datasets, harvested_properties)
    harvest_sdg_and_fos(datasets, harvested_properties, prop_to_harvest=(SDG,))
    harvest_funder(datasets, harvested_properties)
    harvest_url_and_document_type(datasets, harvested_properties)
    harvest_doi(datasets, harvested_properties)
    harvest_country(datasets, harvested_properties)
    harvest_research_community(datasets, harvested_properties)

    datasets = drop_columns(datasets, COLS_TO_DROP)
    harvested_df = create_df(harvested_properties, harvested_schema, spark)
    datasets = join_different_dfs((datasets, harvested_df))
    datasets = add_columns(datasets, COLS_TO_ADD)
    datasets = cast_oag_columns(datasets)
    datasets = replace_empty_str(datasets)
    datasets = datasets.select(sorted(datasets.columns))

    return datasets
