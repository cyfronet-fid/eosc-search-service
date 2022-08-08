# pylint: disable=invalid-name
"""Add columns to a dataframe"""

from typing import Tuple
from pyspark.sql.functions import lit, split, col
from pyspark.sql.dataframe import DataFrame
from pyspark.sql.types import StringType


def add_columns(arr_to_add: Tuple, str_to_add: Tuple, df: DataFrame) -> DataFrame:
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
