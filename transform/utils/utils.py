# pylint: disable=invalid-name, line-too-long
"""Useful functions"""
import traceback
from pyspark.sql import DataFrame
from pyspark.sql.functions import when, col, lit, split
from pyspark.sql.types import StringType, StructType
from transform.conf.logger import Log4J
from transform.utils.send import SOLR, S3, LOCAL_DUMP


def replace_empty_str(df: DataFrame) -> DataFrame:
    """Replace empty strings with None values"""
    # Get only string columns
    str_columns = [item[0] for item in df.dtypes if item[1].startswith("string")]

    for column in str_columns:
        df = df.withColumn(
            column, when(col(column) == "", None).otherwise(col(column)).alias(column)
        )
    return df


def drop_columns(df: DataFrame, col_to_drop: tuple) -> DataFrame:
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
    """Add columns to a dataframe"""
    for c in cols:
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


def print_errors(
    error_type: str, failed_files: dict, col_name: str, file: str, logger: Log4J
) -> None:
    """Print errors"""
    handled_errors = ("transform_fail", "consistency_fail")
    if error_type not in handled_errors:
        raise ValueError(f"error_type not in {handled_errors}")

    for dest in (SOLR, S3, LOCAL_DUMP):
        failed_files[col_name][dest].append(file)
    logger.error(f"{col_name} - {file} - {error_type}")
    traceback.print_exc()


def sort_schema(schema: StructType) -> StructType:
    """Sort alphabetically schema based on the name of the columns"""
    return StructType(sorted(schema, key=lambda _col: getattr(_col, "name")))
