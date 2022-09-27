# pylint: disable=wildcard-import, unused-wildcard-import
"""Transform software"""

from pyspark.sql import SparkSession
from transform.all_collection.spark.utils.common_df_transformations import *
from transform.all_collection.spark.utils.join_dfs import create_df, join_different_dfs
from transform.all_collection.spark.utils.utils import drop_columns, add_columns
from transform.all_collection.spark.schemas.input_col_name import (
    TITLE,
    UNIQUE_SERVICE_COLUMNS,
)


COLS_TO_ADD = (
    *UNIQUE_SERVICE_COLUMNS,
    "fos",
    "sdg",
    "size",
    "subtitle",
    "version",
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
    "format",
    "instance",
    "lastupdatetimestamp",
    "originalId",
    "projects",
    "pid",
    "subject",
)


def transform_software(software: DataFrame, spark: SparkSession) -> DataFrame:
    """
    Required actions/transformations:
    1) Check if all records have type == dataset
    2) Rename maintitle -> title
    3) Simplify bestaccessright
    4) Simplify language
    5) Harvest author_names and author_pids
    6) Create open_access
    7) Harvest funder
    8) Harvest urls and document_type
    9) Harvest country
    10) Harvest research_community
    11) Delete unnecessary columns
    12) Add missing OAG properties
    13) Rename certain columns
    14) Cast certain columns
    15) Add missing services and trainings properties
    """
    harvested_properties = {}

    check_type(software, desired_type="software")
    software = software.withColumnRenamed("maintitle", TITLE)
    software = simplify_bestaccessright(software)
    software = simplify_language(software)

    harvest_author_names_and_pids(software, harvested_properties)
    create_open_access(software, harvested_properties, "bestaccessright")
    harvest_funder(software, harvested_properties)
    harvest_url_and_document_type(software, harvested_properties)
    harvest_country(software, harvested_properties)
    harvest_research_community(software, harvested_properties)

    software = drop_columns(software, COLS_TO_DROP)
    harvested_df = create_df(harvested_properties, spark)

    software = join_different_dfs((software, harvested_df))
    software = add_columns(software, COLS_TO_ADD)
    software = rename_oag_columns(software)
    software = cast_oag_columns(software)
    software = software.select(sorted(software.columns))

    return software
