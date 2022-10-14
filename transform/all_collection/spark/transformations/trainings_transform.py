# pylint: disable=invalid-name, line-too-long
"""Transform trainings"""
import re
from typing import Dict, Sequence
from pyspark.sql import SparkSession
from pyspark.sql.dataframe import DataFrame
from pyspark.sql.types import StringType, IntegerType, StructType
from pyspark.sql.functions import lit, split, col, regexp_replace, translate
from transform.all_collection.spark.transformations.commons import (
    transform_date,
)
from transform.all_collection.spark.utils.utils import (
    drop_columns,
    add_columns,
)
from transform.all_collection.spark.transformations.commons import (
    create_open_access,
)
from transform.all_collection.spark.schemas.input_col_name import (
    DURATION,
    UNIQUE_SERVICE_COLUMNS,
    AUTHOR_NAMES,
    KEYWORDS,
    FORMAT,
)
from transform.all_collection.spark.utils.join_dfs import create_df, join_different_dfs
from transform.all_collection.spark.utils.utils import replace_empty_str

__all__ = ["transform_trainings"]

COLS_TO_ADD = (
    *UNIQUE_SERVICE_COLUMNS,
    "author_pids",
    "code_repository_url",
    "country",
    "document_type",
    "documentation_url",
    "fos",
    "funder",
    "pid",
    "programming_language",
    "publisher",
    "research_community",
    "sdg",
    "size",
    "source",
    "subtitle",
    "version",
)
COLS_TO_DROP = ("duration",)
COLS_TO_RENAME = {
    "Access_Rights_s": "best_access_right",
    "Author_ss": "author_names",
    "Content_Type_s": "content_type",
    "Description_s": "description",
    "Duration_s": "duration",
    "EOSC_PROVIDER_s": "eosc_provider",
    "Format_ss": "format",
    "Keywords_ss": "keywords",
    "Language_s": "language",
    "Level_of_expertise_s": "level_of_expertise",
    "License_s": "license",
    "Qualification_s": "qualification",
    "Resource_Type_s": "resource_type",
    "Resource_title_s": "title",
    "Target_group_s": "target_group",
    "URL_s": "url",
    "Version_date__created_in__s": "publication_date",
}


def transform_trainings(
    trainings: DataFrame, harvested_schema: StructType, spark: SparkSession
) -> DataFrame:
    """
    Terrible quality of data.
    Missing values, nulls everywhere, empty strings,
    different formats of the same property. Be careful.

    Required transformations:
    1) Renaming all columns
    2) Switch from int ids to uuid
    3) Transform duration to seconds as int
    4) Transform Version_date__created_in__s to date format
    5) type => training
    6) Casting certain columns to different types
    7) Add OAG + services specific properties
    """
    harvested_properties = {}

    trainings = rename_trainings_columns(trainings, COLS_TO_RENAME)
    trainings = convert_ids(trainings, increment=1_000_000)
    trainings = trainings.withColumn("type", lit("training"))
    transform_duration(trainings, "duration", harvested_properties)
    trainings = transform_date(trainings, "publication_date", "dd-MM-yyyy")
    trainings = cast_trainings_columns(trainings)
    trainings = cast_invalid_columns(trainings, (AUTHOR_NAMES, FORMAT, KEYWORDS))
    create_open_access(trainings, harvested_properties, "best_access_right")

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
    trainings = (
        trainings.withColumn("description", split(col("description"), ","))
        .withColumn("language", split(col("language"), ","))
        .withColumn("url", split(col("url"), ","))
    )
    return trainings


def cast_invalid_columns(df: DataFrame, columns: Sequence) -> DataFrame:
    """Cast author_names from str to array(str)
    Quality of trainings data is terrible.
    Firstly, certain characters are deleted from the data"""
    for column in columns:
        # For some reason translate creates " " and regexp_replace does not work with chars
        df = df.withColumn(column, translate(col(column), '"[]', ""))
        df = df.withColumn(column, regexp_replace(col(column), " ", ""))
        df = df.withColumn(column, split(col(column), ","))

    return df


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


def transform_duration(
    df: DataFrame, col_name: str, harvested_properties: Dict
) -> None:
    """Transform duration. Expected format HH:MM:SS
    Transform it to number of seconds as int
    """
    durations = df.select(col_name).collect()
    durations_column = []

    for duration in durations:
        duration = duration[col_name]
        if isinstance(duration, str):
            if validate_time_str(duration):
                durations_column.append(get_sec(duration))
            else:
                durations_column.append(None)
        else:
            durations_column.append(None)

    harvested_properties[DURATION] = durations_column


def validate_time_str(time_str: str):
    """Validate HH:MM:SS time string
    Assumption: HH:MM:SS is a valid format only. Number of hours can
    Fo example 01:23 is not a valid format.
    """
    pattern = r"^([1-9][0-9]*|[0-9]{2}):[0-5][0-9]:[0-5][0-9]$"
    pat = re.compile(pattern)

    return bool(re.fullmatch(pat, time_str))


def get_sec(time_str: str) -> int:
    """Convert HH:MM:SS string into number of seconds"""
    h, m, s = time_str.split(":")
    return int(h) * 3600 + int(m) * 60 + int(s)
