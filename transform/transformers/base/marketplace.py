# pylint: disable=line-too-long, wildcard-import, unused-wildcard-import, invalid-name, too-many-arguments
"""Transform Marketplace's resources"""
from abc import abstractmethod
from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    split,
)
from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    BooleanType,
)
from transform.transformations.common import *
from transform.transformers.base.base import BaseTransformer
from transform.utils.utils import sort_schema
from transform.schemas.properties_name import ID

SERVICE_TYPE = "service"
DATA_SOURCE_TYPE = "data source"


class MarketplaceBaseTransformer(BaseTransformer):
    """Transformer used to transform Marketplace's resources"""

    def __init__(
        self,
        id_increment: int,
        desired_type: str,
        cols_to_add: tuple[str, ...],
        cols_to_drop: tuple[str, ...],
        spark: SparkSession,
    ):
        super().__init__(
            desired_type, cols_to_add, cols_to_drop, self.cols_to_rename, spark
        )
        # Increase the range of data sources IDs -> to avoid a conflict with service IDs
        self.id_increment = id_increment

    def apply_simple_trans(self, df: DataFrame) -> DataFrame:
        """Apply simple transformations.
        Simple in a way that there is a possibility to manipulate the main dataframe
        without a need to create another dataframe and merging"""
        df = df.withColumn(TYPE, lit(self.type))
        df = self.rename_cols(df)
        df = self.simplify_urls(df)
        df = df.withColumn(ID, (col(ID) + self.id_increment))

        return df

    def apply_complex_trans(self, df: DataFrame) -> DataFrame:
        """Harvest oag properties that requires more complex transformations
        Basically from those harvested properties there will be created another dataframe
        which will be later on merged with the main dataframe"""
        df = map_best_access_right(df, self.harvested_properties, self.type)
        create_open_access(self.harvested_properties)

        return df

    def simplify_urls(self, df: DataFrame) -> DataFrame:
        """Simplify url columns - get only urls"""
        if self.type not in {SERVICE_TYPE, DATA_SOURCE_TYPE}:
            raise ValueError(
                f"{self.type=} not in the scope of {SERVICE_TYPE, DATA_SOURCE_TYPE}"
            )

        if self.type == SERVICE_TYPE:
            url_cols_to_simplify = ("multimedia_urls", "use_cases_urls")
        else:
            url_cols_to_simplify = (
                "multimedia_urls",
                "use_cases_urls",
                "link_research_product_metadata_license_urls",
                "research_product_licensing_urls",
            )

        for urls in url_cols_to_simplify:
            df = df.withColumn(urls, col(urls)[URL])
        return df

    @property
    def harvested_schema(self) -> StructType:
        """Schema of harvested properties"""
        return sort_schema(
            StructType(
                [
                    StructField("best_access_right", StringType(), True),
                    StructField("open_access", BooleanType(), True),
                ]
            )
        )

    @staticmethod
    def cast_columns(df: DataFrame) -> DataFrame:
        """Cast certain columns"""
        df = (
            df.withColumn("description", split(col("description"), ","))
            .withColumn("id", col("id").cast(StringType()))
            .withColumn("publication_date", col("publication_date").cast("date"))
            .withColumn("last_update", col("last_update").cast("date"))
            .withColumn("synchronized_at", col("synchronized_at").cast("date"))
            .withColumn("updated_at", col("updated_at").cast("date"))
        )

        return df

    @property
    def cols_to_rename(self) -> dict[str, str]:
        """Columns to rename. Keys are mapped to the values"""
        return {
            "created_at": "publication_date",
            "order_type": "best_access_right",
            "language_availability": "language",
            "name": "title",
        }

    @property
    @abstractmethod
    def cols_to_add(self) -> tuple[str, ...]:
        """Add those columns to the dataframe"""
        raise NotImplementedError

    @property
    @abstractmethod
    def cols_to_drop(self) -> tuple[str, ...]:
        """Drop those columns to the dataframe"""
        raise NotImplementedError
