# pylint: disable=wildcard-import, unused-wildcard-import
"""Transform software"""

from pyspark.sql import SparkSession
from pyspark.sql.types import StructType
from transform.all_collection.spark.transformations.commons import *
from transform.all_collection.spark.utils.join_dfs import create_df, join_different_dfs
from transform.all_collection.spark.utils.utils import drop_columns, add_columns
from transform.all_collection.spark.schemas.input_col_name import (
    UNIQUE_SERVICE_COLUMNS,
    UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
)
from transform.all_collection.spark.utils.utils import replace_empty_str

__all__ = ["transform_software"]
SOFTWARE_TYPE_VALUE = "software"

COLS_TO_ADD = (
    *UNIQUE_SERVICE_COLUMNS,
    *UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
    "contactgroup",
    "contactperson",
    "size",
    "subtitle",
    "version",
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
    "tool",
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
    "format",
    "indicator",
    "instance",
    "lastupdatetimestamp",
    "originalId",
    "projects",
    "pid",
    "subject",
)


def transform_software(
    software: DataFrame, harvested_schema: StructType, spark: SparkSession
) -> DataFrame:
    """Transform software"""
    harvested_properties = {}

    check_type(software, desired_type=SOFTWARE_TYPE_VALUE)
    software = rename_oag_columns(software)
    software = map_best_access_right(
        software, harvested_properties, SOFTWARE_TYPE_VALUE
    )
    create_open_access(harvested_properties[BEST_ACCESS_RIGHT], harvested_properties)
    software = simplify_language(software)
    software = simplify_indicators(software)
    software = map_publisher(software)

    harvest_author_names_and_pids(software, harvested_properties)
    harvest_sdg_and_fos(software, harvested_properties)
    harvest_funder(software, harvested_properties)
    harvest_url_and_document_type(software, harvested_properties)
    harvest_doi(software, harvested_properties)
    harvest_country(software, harvested_properties)
    harvest_research_community(software, harvested_properties)
    create_unified_categories(software, harvested_properties)

    software = drop_columns(software, COLS_TO_DROP)
    harvested_df = create_df(harvested_properties, harvested_schema, spark)
    software = join_different_dfs((software, harvested_df))
    software = add_columns(software, COLS_TO_ADD)
    software = cast_oag_columns(software)
    software = replace_empty_str(software)
    software = software.select(sorted(software.columns))

    return software
