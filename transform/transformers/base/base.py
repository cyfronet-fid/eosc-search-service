# pylint: disable=line-too-long, too-many-arguments), invalid-name
"""Base transformer"""
from abc import ABC, abstractmethod
from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.types import StructType
from utils.join_dfs import create_df, join_different_dfs
from utils.utils import drop_columns, add_columns, replace_empty_str
from transformations.common import add_tg_fields


class BaseTransformer(ABC):
    """Base transformer class"""

    def __init__(
        self,
        desired_type: str,
        cols_to_add: tuple[str, ...] | None,
        cols_to_drop: tuple[str, ...] | None,
        cols_to_rename: dict[str, str] | None,
        spark: SparkSession,
    ):
        self.type = desired_type
        self._cols_to_add = cols_to_add
        self._cols_to_drop = cols_to_drop
        self._cols_to_rename = cols_to_rename
        self.spark = spark
        self.harvested_properties = {}

    def __call__(self, df: DataFrame) -> DataFrame:
        """Transform resources"""
        df = self.apply_simple_trans(df)
        if self.harvested_schema:
            df = self.apply_complex_trans(df)

        df = self.apply_common_trans(df)
        df = self.cast_columns(df)

        return df

    def apply_common_trans(self, df: DataFrame) -> DataFrame:
        """Apply common transformations"""
        if self._cols_to_drop:
            df = drop_columns(df, self._cols_to_drop)

        if self.harvested_schema:
            harvested_df = create_df(
                self.harvested_properties, self.harvested_schema, self.spark
            )
            df = join_different_dfs((df, harvested_df))

        if self._cols_to_add:
            df = add_columns(df, self._cols_to_add)

        df = add_tg_fields(df)
        df = replace_empty_str(df)
        df = df.select(sorted(df.columns))

        return df

    def rename_cols(self, df: DataFrame) -> DataFrame:
        """Rename columns based on the mappings dict"""
        for old_col_name, new_col_name in self._cols_to_rename.items():
            df = df.withColumnRenamed(old_col_name, new_col_name)

        return df

    def __repr__(self):
        return f"{self.__class__.__name__}({self.type})"

    @abstractmethod
    def apply_simple_trans(self, df: DataFrame) -> DataFrame:
        """Apply simple transformations.
        Simple in a way that there is a possibility to manipulate the main dataframe
        without a need to create another dataframe and merging"""
        raise NotImplementedError

    @abstractmethod
    def apply_complex_trans(self, df: DataFrame) -> DataFrame | None:
        """Harvest oag properties that requires more complex transformations
        Basically from those harvested properties there will be created another dataframe
        which will be later on merged with the main dataframe"""
        raise NotImplementedError

    @staticmethod
    @abstractmethod
    def cast_columns(df: DataFrame) -> DataFrame:
        """Cast certain columns"""
        raise NotImplementedError

    @property
    @abstractmethod
    def harvested_schema(self) -> StructType | None:
        """Schema of harvested properties"""
        raise NotImplementedError

    @property
    @abstractmethod
    def cols_to_rename(self) -> dict[str, str]:
        """Columns to rename. Keys are mapped to the values"""
        raise NotImplementedError
