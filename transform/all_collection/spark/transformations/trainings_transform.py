# pylint: disable=invalid-name, line-too-long
"""Transform trainings"""
from typing import Dict
from pyspark.sql import SparkSession
from pyspark.sql.dataframe import DataFrame
from pyspark.sql.types import StringType, IntegerType, StructType
from pyspark.sql.functions import lit, split, col
from transform.all_collection.spark.transformations.commons import (
    transform_date,
    map_best_access_right,
)
from transform.all_collection.spark.utils.utils import (
    drop_columns,
    add_columns,
)
from transform.all_collection.spark.transformations.commons import (
    create_open_access,
    create_unified_categories,
)
from transform.all_collection.spark.schemas.input_col_name import (
    UNIQUE_SERVICE_COLUMNS,
    BEST_ACCESS_RIGHT,
    UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
)
from transform.all_collection.spark.utils.join_dfs import create_df, join_different_dfs
from transform.all_collection.spark.utils.utils import replace_empty_str

__all__ = ["transform_trainings"]
TRAINING_TYPE_VALUE = "training"

COLS_TO_ADD = (
    *UNIQUE_SERVICE_COLUMNS,
    *UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
    "author_pids",
    "contactgroup",
    "contactperson",
    "country",
    "document_type",
    "documentation_url",
    "doi",
    "fos",
    "format",
    "funder",
    "horizontal",
    "pid",
    "programming_language",
    "publisher",
    "research_community",
    "sdg",
    "size",
    "source",
    "subtitle",
    "tool",
    "usage_counts_downloads",
    "usage_counts_views",
    "version",
)
COLS_TO_DROP = ()
COLS_TO_RENAME = {
    "Access_Rights_s": "best_access_right",
    "Author_ss": "author_names",
    "Content_Type_ss": "content_type",
    "Description_s": "description",
    "Duration_s": "duration",
    "EOSC_Provider_ss": "eosc_provider",
    "Keywords_ss": "keywords",
    "Language_ss": "language",
    "Level_of_expertise_s": "level_of_expertise",
    "License_s": "license",
    "Qualification_ss": "qualification",
    "Resource_Title_s": "title",
    "Resource_Type_ss": "resource_type",
    "Target_Group_ss": "target_group",
    "URL_s": "url",
    "Version_Date_Created_In_s": "publication_date",
}


def transform_trainings(
    trainings: DataFrame, harvested_schema: StructType, spark: SparkSession
) -> DataFrame:
    """Transform trainings"""
    harvested_properties = {}

    trainings = rename_trainings_columns(trainings, COLS_TO_RENAME)
    trainings = convert_ids(trainings, increment=1_000_000)
    trainings = trainings.withColumn("type", lit(TRAINING_TYPE_VALUE))
    trainings = map_best_access_right(
        trainings, harvested_properties, TRAINING_TYPE_VALUE
    )
    create_open_access(harvested_properties[BEST_ACCESS_RIGHT], harvested_properties)
    trainings = transform_date(trainings, "publication_date", "yyyy-MM-dd")
    trainings = cast_trainings_columns(trainings)
    create_unified_categories(trainings, harvested_properties)

    trainings = drop_columns(trainings, COLS_TO_DROP)
    harvested_df = create_df(harvested_properties, harvested_schema, spark)
    trainings = join_different_dfs((trainings, harvested_df))
    trainings = add_columns(trainings, COLS_TO_ADD)
    trainings = replace_empty_str(trainings)
    trainings = trainings.select(sorted(trainings.columns))

    return trainings


def rename_trainings_columns(trainings: DataFrame, cols_to_rename: Dict) -> DataFrame:
    """Rename trainings columns"""
    for col_org, col_new in cols_to_rename.items():
        trainings = trainings.withColumnRenamed(col_org, col_new)

    return trainings


def cast_trainings_columns(trainings: DataFrame) -> DataFrame:
    """Cast trainings columns"""
    trainings = trainings.withColumn(
        "description", split(col("description"), ",")
    ).withColumn("url", split(col("url"), ","))
    return trainings


def convert_ids(df: DataFrame, increment) -> DataFrame:
    """Convert range of trainings ID.
    Range of trainings ID collide with range of services ID.
    To avoid conflicts, trainings ID are incremented by safe constant."""
    int_ids = df.select("id").collect()
    assert all(
        (_id["id"].isdigit() for _id in int_ids)
    ), "At least 1 training ID is not a digit"

    return df.withColumn(
        "id", (col("id") + increment).cast(IntegerType()).cast(StringType())
    )
