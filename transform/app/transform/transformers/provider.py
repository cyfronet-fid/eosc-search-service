# pylint: disable=line-too-long, wildcard-import, unused-wildcard-import, invalid-name, duplicate-code
"""Transform Marketplace's resources"""
from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.functions import col, lit, split
from pyspark.sql.types import IntegerType, StringType, StructField, StructType
from pyspark.sql.utils import AnalysisException

from app.settings import settings
from app.transform.transformers.base.base import BaseTransformer
from app.transform.utils.common import harvest_popularity
from app.transform.utils.utils import sort_schema
from schemas.old.output.provider import provider_output_schema
from schemas.properties.data import ID, POPULARITY, TYPE, URL


class ProviderTransformer(BaseTransformer):
    """Transformer used to transform providers"""

    def __init__(self, spark: SparkSession):
        self.type = settings.PROVIDER
        # Increase the range of providers IDs -> to avoid a conflicts
        self.id_increment = settings.PROVIDER_IDS_INCREMENTOR
        self.exp_output_schema = provider_output_schema

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
        df = self.simplify_urls(df)
        df = df.withColumn(ID, (col(ID) + self.id_increment))
        df = df.withColumn(
            "catalogue", self.get_first_element(df["catalogues"])
        )  # TODO delete

        return df

    def apply_complex_trans(self, df: DataFrame) -> DataFrame:
        """Harvest properties that requires more complex transformations
        Basically from those harvested properties there will be created another dataframe
        which will be later on merged with the main dataframe"""
        harvest_popularity(df, self.harvested_properties)
        return df

    @staticmethod
    def simplify_urls(df: DataFrame) -> DataFrame:
        """Simplify url columns - get only urls"""
        url_cols_to_simplify = ("multimedia_urls",)

        for urls in url_cols_to_simplify:
            try:
                df = df.withColumn(urls, col(urls)[URL])
            except AnalysisException:
                continue
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

    @staticmethod
    def cast_columns(df: DataFrame) -> DataFrame:
        """Cast certain columns"""
        df = (
            df.withColumn("webpage_url", split(col("webpage_url"), ","))
            .withColumn("country", split(col("country"), ","))
            .withColumn("id", col("id").cast(StringType()))
            .withColumn("publication_date", col("publication_date").cast("date"))
            .withColumn("updated_at", col("updated_at").cast("date"))
        )

        return df

    @property
    def cols_to_rename(self) -> dict[str, str]:
        """Columns to rename. Keys are mapped to the values"""
        return {
            "language_availability": "language",
            "name": "title",
            "provider_life_cycle_status": "life_cycle_status",
        }

    @property
    def cols_to_add(self) -> None:
        """Add those columns to the dataframe"""
        return None

    @property
    def cols_to_drop(self) -> tuple[str, ...]:
        """Drop those columns from the dataframe"""
        return ("public_contacts",)
