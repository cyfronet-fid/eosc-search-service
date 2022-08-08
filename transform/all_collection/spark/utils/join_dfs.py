"""Join dataframes"""
from functools import reduce
from typing import List
from pyspark.sql.dataframe import DataFrame


def join_dfs(dfs: List[DataFrame]) -> DataFrame:
    """Join all dataframes.
    It assumes that dataframes have the same columns"""
    return reduce(lambda df1, df2: df1.union(df2.select(df1.columns)), dfs)
