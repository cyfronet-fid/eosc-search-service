# pylint: disable=line-too-long, wildcard-import, invalid-name, unused-wildcard-import, duplicate-code
"""Transform bundles"""
from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.functions import col, lit, udf
from pyspark.sql.types import (
    ArrayType,
    IntegerType,
    StringType,
    StructField,
    StructType,
)

from app.settings import settings
from app.transform.transformers.base.base import BaseTransformer
from app.transform.utils.common import harvest_popularity
from app.transform.utils.utils import sort_schema
from schemas.old.output.bundle import bundle_output_schema
from schemas.properties.data import ID, POPULARITY, TYPE


class BundleTransformer(BaseTransformer):
    """Transformer used to transform bundles"""

    def __init__(self, spark: SparkSession):
        self.type = settings.BUNDLE
        self.id_increment = settings.BUNDLE_IDS_INCREMENTOR
        self.exp_output_schema = bundle_output_schema

        super().__init__(
            self.type,
            self.cols_to_add,
            self.cols_to_drop,
            self.cols_to_rename,
            self.exp_output_schema,
            spark,
        )

    def apply_simple_trans(self, df: DataFrame) -> DataFrame:
        """Apply simple transformations.
        Simple in a way that there is a possibility to manipulate the main dataframe
        without a need to create another dataframe and merging"""
        df = df.withColumn(TYPE, lit(self.type))
        df = self.rename_cols(df)
        # Increase bundles IDs to avoid confilicts
        df = self.convert_int_ids(df, columns=(ID,), increment=self.id_increment)
        # Increase offers IDs to match their increased IDs
        df = self.convert_int_ids(
            df, columns=("main_offer_id",), increment=settings.OFFER_IDS_INCREMENTOR
        )
        df = self.convert_arr_ids(
            df, columns=("offer_ids",), increment=settings.OFFER_IDS_INCREMENTOR
        )
        df = df.withColumn(
            "catalogue", self.get_first_element(df["catalogues"])
        )  # TODO delete

        return df

    def apply_complex_trans(self, df: DataFrame) -> DataFrame:
        """Harvest oag properties that requires more complex transformations
        Basically from those harvested properties there will be created another dataframe
        which will be later on merged with the main dataframe"""
        harvest_popularity(df, self.harvested_properties)
        return df

    @staticmethod
    def cast_columns(df: DataFrame) -> DataFrame:
        """Cast columns"""
        df = df.withColumn(
            "publication_date", col("publication_date").cast("date")
        ).withColumn("updated_at", col("updated_at").cast("date"))

        return df

    @property
    def harvested_schema(self) -> StructType:
        """Schema of harvested properties"""
        return sort_schema(
            StructType(
                [
                    StructField(POPULARITY, IntegerType(), True),
                ]
            )
        )

    @property
    def cols_to_add(self) -> None:
        """Add those columns to the dataframe"""
        return None

    @property
    def cols_to_drop(self) -> None:
        """Drop those columns from the dataframe"""
        return None

    @property
    def cols_to_rename(self) -> dict[str, str]:
        """Columns to rename. Keys are mapped to the values"""
        return {
            "name": "title",
            "research_steps": "unified_categories",
            "target_users": "dedicated_for",
        }

    @staticmethod
    def convert_int_ids(
        df: DataFrame, columns: tuple[str, ...], increment: int
    ) -> DataFrame:
        """Convert dataframes IDs that are integers"""
        for column in columns:
            df = df.withColumn(column, (col(column) + increment).cast(StringType()))

        return df

    @staticmethod
    def convert_arr_ids(
        df: DataFrame, columns: tuple[str, ...], increment: int
    ) -> DataFrame:
        """Convert IDs that are array<int>"""
        inc_ids = udf(lambda x: [i + increment for i in x], ArrayType(IntegerType()))

        for column in columns:
            df = df.withColumn(column, inc_ids(column))

        return df
