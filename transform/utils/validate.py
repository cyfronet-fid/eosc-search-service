from typing import Dict, Sequence

from pyspark.sql import SparkSession

from transform import transformers as trans
from transform.conf.logger import Log4J
from transform.utils.join_dfs import join_identical_dfs
from transform.utils.loader import load_data, FIRST_FILE_PATH, FIRST_FILE_DF


def check_trans_consistency(
    collections: Dict, spark: SparkSession, logger: Log4J
) -> None:
    """Check whether all data types after transformations will have the schema
    such that it will be possible to send all data into single solr collection"""
    dfs = {}
    for col_name, col_val in collections.items():
        _df = load_data(spark, col_val[FIRST_FILE_PATH], col_name)
        # Transform each first file from each collection
        dfs[col_name] = trans.trans_map[col_name](spark)(_df)
        collections[col_name][FIRST_FILE_DF] = dfs[col_name]

    dfs_to_join = list(dfs.values())
    check_dfs_cols(dfs_to_join)
    assert join_identical_dfs(
        dfs_to_join
    ), "Joining dataframes from the first collections files was unsuccessful. Aborting..."
    logger.info("Transformation of the first collections files was successful")


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
