# pylint: disable=wildcard-import, unused-wildcard-import
"""Transform publications"""

from pyspark.sql import SparkSession
from pyspark.sql.types import StructType
from transform.all_collection.spark.transformations.commons import *
from transform.all_collection.spark.utils.join_dfs import create_df, join_different_dfs
from transform.all_collection.spark.schemas.input_col_name import (
    FOS,
    SDG,
    UNIQUE_SERVICE_COLUMNS,
)
from transform.all_collection.spark.utils.utils import drop_columns, add_columns
from transform.all_collection.spark.utils.utils import replace_empty_str

__all__ = ["transform_publications"]

COLS_TO_ADD = (
    *UNIQUE_SERVICE_COLUMNS,
    "code_repository_url",
    "documentation_url",
    "programming_language",
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


def transform_publications(
    publications: DataFrame, harvested_schema: StructType, spark: SparkSession
) -> DataFrame:
    """Transform publications"""
    col_name = "publication"
    harvested_properties = {}

    check_type(publications, desired_type=col_name)
    publications = rename_oag_columns(publications)
    publications = harvest_best_access_right(
        publications, harvested_properties, col_name
    )
    create_open_access(harvested_properties[BEST_ACCESS_RIGHT], harvested_properties)
    publications = simplify_language(publications)

    harvest_author_names_and_pids(publications, harvested_properties)
    harvest_sdg_and_fos(publications, harvested_properties, prop_to_harvest=(SDG, FOS))
    harvest_funder(publications, harvested_properties)
    harvest_url_and_document_type(publications, harvested_properties)
    harvest_doi(publications, harvested_properties)
    harvest_country(publications, harvested_properties)
    harvest_research_community(publications, harvested_properties)

    publications = drop_columns(publications, COLS_TO_DROP)
    harvested_df = create_df(harvested_properties, harvested_schema, spark)
    publications = join_different_dfs((publications, harvested_df))
    publications = add_columns(publications, COLS_TO_ADD)
    publications = cast_oag_columns(publications)
    publications = replace_empty_str(publications)
    publications = publications.select(sorted(publications.columns))

    return publications
