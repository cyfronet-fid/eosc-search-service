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


__all__ = ["transform_other_rp"]
OTHER_RP_TYPE_VALUE = "other"

COLS_TO_ADD = (
    *UNIQUE_SERVICE_COLUMNS,
    *UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
    "documentation_url",
    "programming_language",
    "subtitle",
    "size",
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
    "version",
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


def transform_other_rp(
    other_rp: DataFrame, harvested_schema: StructType, spark: SparkSession
) -> DataFrame:
    """Transform other research products"""
    harvested_properties = {}

    other_rp = other_rp.withColumn(TYPE, lit(OTHER_RP_TYPE_VALUE))
    check_type(other_rp, desired_type=OTHER_RP_TYPE_VALUE)
    other_rp = rename_oag_columns(other_rp)
    other_rp = map_best_access_right(
        other_rp, harvested_properties, OTHER_RP_TYPE_VALUE
    )
    create_open_access(harvested_properties[BEST_ACCESS_RIGHT], harvested_properties)
    other_rp = simplify_language(other_rp)
    other_rp = simplify_indicators(other_rp)
    other_rp = map_publisher(other_rp)

    harvest_author_names_and_pids(other_rp, harvested_properties)
    harvest_sdg_and_fos(other_rp, harvested_properties)
    harvest_funder(other_rp, harvested_properties)
    harvest_url_and_document_type(other_rp, harvested_properties)
    harvest_doi(other_rp, harvested_properties)
    harvest_country(other_rp, harvested_properties)
    harvest_research_community(other_rp, harvested_properties)
    create_unified_categories(other_rp, harvested_properties)

    other_rp = drop_columns(other_rp, COLS_TO_DROP)
    harvested_df = create_df(harvested_properties, harvested_schema, spark)
    other_rp = join_different_dfs((other_rp, harvested_df))
    other_rp = add_columns(other_rp, COLS_TO_ADD)
    other_rp = cast_oag_columns(other_rp)
    other_rp = replace_empty_str(other_rp)
    other_rp = other_rp.select(sorted(other_rp.columns))

    return other_rp
