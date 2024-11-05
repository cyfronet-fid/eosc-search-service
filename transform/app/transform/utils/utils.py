# pylint: disable=invalid-name, line-too-long
"""Useful functions"""
import os
import traceback
from logging import getLogger
from typing import List

import pandas as pd
from pyspark.sql import DataFrame
from pyspark.sql.functions import col, lit, split, when
from pyspark.sql.types import StringType, StructType

from app.services.spark.logger import Log4J
from app.settings import settings

logger = getLogger(__name__)


def replace_empty_str(df: DataFrame) -> DataFrame:
    """Replace empty strings with None values"""
    # Get only string columns
    str_columns = [item[0] for item in df.dtypes if item[1].startswith("string")]

    for column in str_columns:
        df = df.withColumn(
            column, when(col(column) == "", None).otherwise(col(column)).alias(column)
        )
    return df


def drop_columns_pyspark(df: DataFrame, col_to_drop: tuple) -> DataFrame:
    """Drop columns from dataframe"""
    return df.drop(*col_to_drop)


def add_typed_columns(arr_to_add: tuple, str_to_add: tuple, df: DataFrame) -> DataFrame:
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


def add_columns(df: DataFrame, cols: tuple) -> DataFrame:
    """Add columns to a dataframe if they are not present already.
    Used when certain dfs of a given type contain certain cols, but others don't"""
    for c in cols:
        if c not in df.columns:
            df = df.withColumn(c, lit(None))

    return df


def print_results(failed_files: dict, logger: Log4J) -> None:
    """Print results"""

    def _print(_col_name: str, _f_file: str, _dest: str) -> None:
        """Helpful print"""
        nonlocal err_printed
        if _f_file:
            if not err_printed:
                err_printed = True
                logger.error(
                    "Certain files failed either to be transformed or to be sent to Solr/S3/Local_dump"
                )
            logger.error(f"{_col_name}: {_f_file}, destination: {_dest}")

    err_printed = False
    logger.info("Data transformation and sending data to Solr were successful!")

    for col_name, dests in failed_files.items():
        for dest, f_file in dests.items():
            _print(col_name, f_file, dest)


def sort_schema(schema: StructType) -> StructType:
    """Sort alphabetically schema based on the name of the columns"""
    return StructType(sorted(schema, key=lambda _col: getattr(_col, "name")))


def extract_digits_and_trim(input_str: str):
    """Extract digits and trim the string"""
    # Delete spaces
    input_str = input_str.strip()

    # Find index in which digits ends
    index = 0
    for char in input_str:
        if not char.isdigit():
            break
        index += 1

    remaining_str = input_str[index:].strip()

    return remaining_str


def normalize_directory_name(directory_name: str) -> str:
    """
    Normalize directory names to match the naming convention used in settings.

    Parameters:
        directory_name (str): The original directory name.

    Returns:
        str: The normalized directory name.
    """
    normalization_map = {
        "organization": "organisation",
        "otherresearchproduct": "other_rp",
    }
    return normalization_map.get(directory_name, directory_name)


def create_file_path_column(
    df: pd.DataFrame, directory_column: str, file_column: str
) -> pd.Series:
    """
    Creates a new column in the pandas DataFrame with concatenated file path.

    Parameters:
        df (pd.DataFrame): The DataFrame to process.
        directory_column (str): Column which will be used to get a specific path from settings.
        file_column (str): Column which contains file names.

    Returns:
        A pandas Series object representing the new column with file path.
    """
    return df.apply(
        lambda row: os.path.join(
            settings.COLLECTIONS[normalize_directory_name(row[directory_column])][
                "PATH"
            ],
            row[file_column],
        ),
        axis=1,
    )


def group_relations(
    df: pd.DataFrame, group_by_columns: List[str], agg_column: str
) -> pd.DataFrame:
    """
    Groups the DataFrame by specified columns and aggregates another column into a list.

    Parameters:
        df (pd.DataFrame): The DataFrame to process.
        group_by_columns (List[str]): List of column names to group the DataFrame by.
        agg_column (str): The column to aggregate into a list.

    Returns:
        A grouped and aggregated pandas DataFrame.
    """
    return (
        df.groupby(group_by_columns)
        .agg({agg_column: lambda x: x.tolist()})
        .reset_index()
    )


def drop_columns_pandas(df: pd.DataFrame, columns: List[str]) -> None:
    """Drops inplace specified columns from the DataFrame."""
    df.drop(columns, axis=1, inplace=True)


def handle_missing_column(
    df: DataFrame, column_name: str, harvested_properties: dict, keys: list, placeholder
) -> bool:
    """
    Check if a column exists in the DataFrame. If missing, log a warning and populate
    the harvested_properties dictionary with placeholder values.

    Parameters:
        df (DataFrame): The input DataFrame.
        column_name (str): The column name to check.
        harvested_properties (dict): The dictionary to update with placeholder values.
        keys (list): List of keys in harvested_properties to update with placeholders.
        placeholder: Placeholder value to fill in when the column is missing.

    Returns:
        bool: True if the column is missing, False otherwise.
    """
    if column_name not in df.columns:
        logger.warning(f"{column_name} column is missing from DataFrame")
        row_count = df.rdd.isEmpty()
        placeholder_values = [placeholder] * (df.count() if not row_count else 0)

        for key in keys:
            harvested_properties[key] = placeholder_values
        return True
    return False
