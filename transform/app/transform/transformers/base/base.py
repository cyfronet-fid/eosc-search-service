# pylint: disable=line-too-long, too-many-arguments), invalid-name
"""Base transformer"""
from abc import ABC, abstractmethod
from logging import getLogger

from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.functions import col, udf
from pyspark.sql.types import StringType, StructType

from app.services.solr.validate.schema.validate import validate_schema
from app.transform.utils.common import add_tg_fields
from app.transform.utils.join_dfs import create_df, join_different_dfs
from app.transform.utils.utils import (
    add_columns,
    drop_columns_pyspark,
    replace_empty_str,
)

logger = getLogger(__name__)


class BaseTransformer(ABC):
    """Base transformer class"""

    def __init__(
        self,
        desired_type: str,
        cols_to_add: tuple[str, ...] | None,
        cols_to_drop: tuple[str, ...] | None,
        cols_to_rename: dict[str, str] | None,
        exp_output_schema: dict,
        spark: SparkSession,
    ):
        self.type = desired_type
        self._cols_to_add = cols_to_add
        self._cols_to_drop = cols_to_drop
        self._cols_to_rename = cols_to_rename
        self._exp_output_schema = exp_output_schema
        self.spark = spark
        self.harvested_properties = {}

    def __call__(self, df: DataFrame) -> DataFrame:
        """Transform resources"""
        df = self.apply_simple_trans(df)
        if self.harvested_schema:
            df = self.apply_complex_trans(df)

        df = self.apply_common_trans(df)
        df = self.cast_columns(df)
        df = self.filter_columns(df)
        self.validate(df)

        return df

    def apply_common_trans(self, df: DataFrame) -> DataFrame:
        """Apply common transformations"""
        if self._cols_to_drop:
            df = drop_columns_pyspark(df, self._cols_to_drop)

        if self.harvested_schema:
            harvested_df = create_df(
                self.harvested_properties, self.harvested_schema, self.spark
            )
            df = join_different_dfs((df, harvested_df))

        if self._cols_to_add:
            df = add_columns(df, self._cols_to_add)

        if self.type == "training":
            df = df.withColumn("eosc_provider", col("providers"))  # TODO delete

        df = add_tg_fields(df)
        df = replace_empty_str(df)
        df = df.select(sorted(df.columns))

        return df

    def rename_cols(self, df: DataFrame) -> DataFrame:
        """Rename columns based on the mappings dict"""
        for old_col_name, new_col_name in self._cols_to_rename.items():
            df = df.withColumnRenamed(old_col_name, new_col_name)

        return df

    def filter_columns(self, df: DataFrame) -> DataFrame:
        """Take only those columns that are present in expected output schema
        In that manner, if any column was added additionally it won't be included in output data
        """
        expected_columns = [
            col for col in df.columns if col in self._exp_output_schema.keys()
        ]
        return df.select(*expected_columns)

    def validate(self, df: DataFrame) -> None:
        """Validate output schema after transformation"""
        try:
            validate_schema(
                df,
                self._exp_output_schema,
                collection=self.type,
                source="output",
            )
        except AssertionError:
            logger.error(
                f"Schema validation after transformation failed for type={self.type}. Output schema is different than excepted"
            )

    @staticmethod
    @udf(StringType())
    def get_first_element(arr):  # TODO delete
        if arr:
            return arr[0]
        else:
            return None

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
