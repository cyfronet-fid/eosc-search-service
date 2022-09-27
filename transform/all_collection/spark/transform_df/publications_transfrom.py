# pylint: disable=wildcard-import, unused-wildcard-import
"""Transform publications"""

from pyspark.sql import SparkSession
from transform.all_collection.spark.utils.common_df_transformations import *
from transform.all_collection.spark.utils.join_dfs import create_df, join_different_dfs
from transform.all_collection.spark.schemas.input_col_name import (
    TITLE,
    UNIQUE_SERVICE_COLUMNS,
)
from transform.all_collection.spark.utils.utils import drop_columns, add_columns


COLS_TO_ADD = (
    *UNIQUE_SERVICE_COLUMNS,
    "codeRepositoryUrl",
    "documentationUrl",
    "programmingLanguage",
    "size",
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
    "container",
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


def transform_publications(publications: DataFrame, spark: SparkSession) -> DataFrame:
    """
    Required actions/transformations:
    1) Check if all records have type == dataset
    2) Rename maintitle -> title
    3) Simplify bestaccessright
    4) Simplify language
    5) Harvest author_names and author_pids
    6) Add FOS (only publications have FOS)
    7) Add SDG (only publications and datasets have SDG)
    8) Create open_access
    9) Harvest funder
    10) Harvest urls and document_type
    11) Harvest country
    12) Harvest research_community
    13) Delete unnecessary columns
    14) Add missing OAG properties
    15) Rename certain columns
    16) Cast certain columns
    17) Add missing services and trainings properties
    """
    harvested_properties = {}

    check_type(publications, desired_type="publication")
    publications = publications.withColumnRenamed("maintitle", TITLE)
    publications = simplify_bestaccessright(publications)
    publications = simplify_language(publications)

    harvest_author_names_and_pids(publications, harvested_properties)
    harvest_fos(publications, harvested_properties)
    harvest_sdg(publications, harvested_properties)
    create_open_access(publications, harvested_properties, "bestaccessright")
    harvest_funder(publications, harvested_properties)
    harvest_url_and_document_type(publications, harvested_properties)
    harvest_country(publications, harvested_properties)
    harvest_research_community(publications, harvested_properties)

    publications = drop_columns(publications, COLS_TO_DROP)
    harvested_df = create_df(harvested_properties, spark)

    publications = join_different_dfs((publications, harvested_df))
    publications = add_columns(publications, COLS_TO_ADD)
    publications = rename_oag_columns(publications)
    publications = cast_oag_columns(publications)
    publications = publications.select(sorted(publications.columns))

    return publications
