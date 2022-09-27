# pylint: disable=invalid-name, unbalanced-tuple-unpacking
"""Join dataframes"""
from functools import reduce
from typing import Tuple, List, Dict

from pyspark.sql import Window, DataFrame
from pyspark.sql.functions import row_number, lit
from pyspark.sql import SparkSession


def add_row_idxes(df_seq: Tuple) -> List:
    """Add row_idxes to dataframes"""
    w = Window.orderBy(lit(1))
    final_df_list = []
    for df in df_seq:
        df = df.withColumn("row_idx", row_number().over(w) - 1)
        final_df_list.append(df)

    return final_df_list


def join_different_dfs(df_seq: Tuple) -> DataFrame:
    """Join dataframes that have different columns based on row_idx
    Important note: dataframes will be joined to the first dataframe in the tuple"""
    main_df = df_seq[0]

    for _, df_to_merge in enumerate(df_seq, start=1):
        assert (
            main_df.count() == df_to_merge.count()
        ), "Dataframes have different shapes, they cannot be joined"
        main_df, df_to_merge = add_row_idxes((df_seq[0], df_to_merge))
        main_df = main_df.join(df_to_merge, ["row_idx"]).drop("row_idx")

    return main_df


def join_identical_dfs(dfs: List[DataFrame]) -> DataFrame:
    """Join all dataframes.
    It assumes that dataframes have the same columns"""
    return reduce(lambda df1, df2: df1.union(df2.select(df1.columns)), dfs)


def create_df(harvested_properties: Dict, spark: SparkSession) -> DataFrame:
    """Create dataframe from dict of <name_of_column>: <column_values>"""
    it = iter(harvested_properties.values())
    _len = len(next(it))
    assert all(
        len(l) == _len for l in it
    ), "Not all lists have the same length, creating df is not possible"

    rows = list(zip(*harvested_properties.values()))
    df = spark.createDataFrame(rows, schema=list(harvested_properties.keys()))

    return df
