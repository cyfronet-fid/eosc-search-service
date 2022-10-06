# pylint: disable=wildcard-import, unused-wildcard-import
"""Transform datasets"""

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
    "codeRepositoryUrl",
    "documentationUrl",
    "fos",
    "programmingLanguage",
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


def transform_datasets(datasets: DataFrame, spark: SparkSession) -> DataFrame:
    """
    Required actions/transformations:
    1) Check if all records have type == dataset
    2) Rename maintitle -> title
    3) Simplify bestaccessright
    4) Simplify language
    5) Harvest author_names and author_pids
    6) Add SDG (only publications and datasets have SDG)
    7) Create open_access
    8) Harvest funder
    9) Harvest urls and document_type
    10) Harvest country
    11) Harvest research_community
    12) Delete unnecessary columns
    13) Add missing OAG properties
    14) Rename certain columns
    15) Cast certain columns
    16) Add missing services and trainings properties
    """
    harvested_properties = {}

    check_type(datasets, desired_type="dataset")
    datasets = datasets.withColumnRenamed("maintitle", TITLE)
    datasets = simplify_bestaccessright(datasets)
    datasets = simplify_language(datasets)

    harvest_author_names_and_pids(datasets, harvested_properties)
    harvest_sdg(datasets, harvested_properties)
    create_open_access(datasets, harvested_properties, "bestaccessright")
    harvest_funder(datasets, harvested_properties)
    harvest_url_and_document_type(datasets, harvested_properties)
    harvest_country(datasets, harvested_properties)
    harvest_research_community(datasets, harvested_properties)

    datasets = drop_columns(datasets, COLS_TO_DROP)
    harvested_df = create_df(harvested_properties, spark)

    datasets = join_different_dfs((datasets, harvested_df))
    datasets = add_columns(datasets, COLS_TO_ADD)
    datasets = rename_oag_columns(datasets)
    datasets = cast_oag_columns(datasets)

    datasets = datasets.select(sorted(datasets.columns))

    return datasets
