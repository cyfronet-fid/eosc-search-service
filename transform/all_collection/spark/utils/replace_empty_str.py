# pylint: disable=invalid-name
"""Save dataframe"""
from pyspark.sql.dataframe import DataFrame
from pyspark.sql.functions import col, when


def replace_empty_str(df: DataFrame) -> DataFrame:
    """Replace empty strings with None values"""
    # Get only string columns
    str_columns = [item[0] for item in df.dtypes if item[1].startswith("string")]

    for column in str_columns:
        df = df.withColumn(
            column, when(col(column) == "", None).otherwise(col(column)).alias(column)
        )
    return df
