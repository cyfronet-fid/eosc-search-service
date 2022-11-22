# pylint: disable=invalid-name, line-too-long
"""Useful functions"""
import traceback
from typing import Tuple, Sequence, Dict
from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.functions import when, col, lit, split
from pyspark.sql.types import StringType
import transform.all_collection.spark.transformations as trans
from transform.all_collection.spark.conf.logger import Log4J
from transform.all_collection.spark.schemas.harvested_props_schemas import (
    harvested_schemas,
)
from transform.all_collection.spark.utils.join_dfs import join_identical_dfs
from transform.all_collection.spark.utils.loader import (
    load_data,
    FIRST_FILE_PATH,
    FIRST_FILE_DF,
)
from transform.all_collection.spark.utils.send_data import SOLR, S3, LOCAL_DUMP


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


def check_dfs_cols(dfs: Sequence) -> None:
    """Check if all dataframes have the same column names and schemas.
    Schema for certain column have to be the same or null type if it is empty.
    Necessary assumption to merge dataframes and send data to the same solr collection."""
    df_columns = [df.columns for df in dfs]
    assert all(
        (columns == df_columns[0] for columns in df_columns)
    ), "Dataframes after transformation don't have the same columns name"

    dfs_cols_schema = [[column.dataType for column in df.schema.fields] for df in dfs]

    for column in zip(*dfs_cols_schema):
        column_schemas = set((str(_col.typeName()) for _col in column))
        # Columns should be the same type as corresponding column in other df or be void type
        if len(column_schemas) == 2:
            assert (
                "void" in column_schemas
            ), f"Schemas between files differ - {column_schemas}"
        else:
            assert len(column_schemas) == 1, "Schemas between files differ"


def check_trans_consistency(
    collections: Dict, spark: SparkSession, logger: Log4J
) -> None:
    """Check whether all data types after transformations will have the schema
    such that it will be possible to send all data into single solr collection"""
    dfs = {}
    for col_name, col_val in collections.items():
        _df = load_data(spark, col_val[FIRST_FILE_PATH], col_name)
        # Transform each first file from each collection
        dfs[col_name] = trans.trans_map[col_name](
            _df, harvested_schemas[col_name], spark
        )
        collections[col_name][FIRST_FILE_DF] = dfs[col_name]

    dfs_to_join = list(dfs.values())
    check_dfs_cols(dfs_to_join)
    assert join_identical_dfs(
        dfs_to_join
    ), "Joining dataframes from the first collections files was unsuccessful. Aborting..."
    logger.info("Transformation of the first collections files was successful")


def print_results(failed_files: Dict, logger: Log4J) -> None:
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
    error_type: str, failed_files: Dict, col_name: str, file: str, logger: Log4J
) -> None:
    """Print errors"""
    handled_errors = ("transform_fail", "consistency_fail")
    if error_type not in handled_errors:
        raise ValueError(f"error_type not in {handled_errors}")

    for dest in (SOLR, S3, LOCAL_DUMP):
        failed_files[col_name][dest].append(file)
    logger.error(f"{col_name} - {file} - {error_type}")
    traceback.print_exc()
