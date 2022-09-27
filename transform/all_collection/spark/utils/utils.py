# pylint: disable=invalid-name
"""Useful functions"""
from typing import Tuple

from pyspark.sql import DataFrame
from pyspark.sql.functions import when, col, lit, split
from pyspark.sql.types import StringType


def replace_empty_str(df: DataFrame) -> DataFrame:
    """Replace empty strings with None values"""
    # Get only string columns
    str_columns = [item[0] for item in df.dtypes if item[1].startswith("string")]

    for column in str_columns:
        df = df.withColumn(
            column, when(col(column) == "", None).otherwise(col(column)).alias(column)
        )
    return df


def drop_columns(df: DataFrame, col_to_drop: Tuple) -> DataFrame:
    """Drop columns from dataframe"""
    return df.drop(*col_to_drop)


def add_typed_columns(arr_to_add: Tuple, str_to_add: Tuple, df: DataFrame) -> DataFrame:
    """
    Add columns to a dataframe.
    Columns filled with None (null in dfs) values - cast to certain type
    """

    for arr in arr_to_add:
        df = df.withColumn(arr, lit(None)).withColumn(arr, split(col(arr), ","))

    for _str in str_to_add:
        df = df.withColumn(_str, lit(None)).withColumn(
            _str, col(_str).cast(StringType())
        )

    return df


def add_columns(df: DataFrame, cols: Tuple) -> DataFrame:
    """Add columns to a dataframe"""
    for c in cols:
        df = df.withColumn(c, lit(None))

    return df
