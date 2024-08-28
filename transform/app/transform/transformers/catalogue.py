# pylint: disable=line-too-long, wildcard-import, unused-wildcard-import, invalid-name, duplicate-code
"""Transform Marketplace's resources"""
from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.functions import col, lit
from pyspark.sql.types import StringType, StructType

from app.settings import settings
from app.transform.transformers.base.base import BaseTransformer
from schemas.old.output.catalogue import catalogue_output_schema
from schemas.properties.data import (
    CREATED_AT,
    ID,
    KEYWORDS,
    NAME,
    PUBLICATION_DATE,
    TAG_LIST,
    TITLE,
    TYPE,
)


class CatalogueTransformer(BaseTransformer):
    """Transformer used to transform catalogues"""

    def __init__(self, spark: SparkSession):
        self.type = settings.CATALOGUE
        # Increase the range of providers IDs -> to avoid a conflicts
        self.id_increment = settings.CATALOGUE_IDS_INCREMENTOR
        self.exp_output_schema = catalogue_output_schema

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
        df = df.withColumn(ID, (col(ID) + self.id_increment))

        return df

    def apply_complex_trans(self, df: DataFrame) -> DataFrame:
        """Harvest oag properties that requires more complex transformations
        Basically from those harvested properties there will be created another dataframe
        which will be later on merged with the main dataframe"""

        raise df

    @staticmethod
    def cast_columns(df: DataFrame) -> DataFrame:
        """Cast certain columns"""
        df = df.withColumn("id", col("id").cast(StringType())).withColumn(
            "publication_date", col("publication_date").cast("date")
        )
        return df

    @property
    def harvested_schema(self) -> StructType | None:
        """Schema of harvested properties"""
        return None

    @property
    def cols_to_rename(self) -> dict[str, str]:
        """Columns to rename. Keys are mapped to the values"""
        return {
            CREATED_AT: PUBLICATION_DATE,
            NAME: TITLE,
            TAG_LIST: KEYWORDS,
        }

    @property
    def cols_to_add(self) -> None:
        """Add those columns to the dataframe"""
        return None

    @property
    def cols_to_drop(self) -> tuple[str, ...]:
        """Drop those columns from the dataframe"""
        return (
            "affiliations",
            "city",
            "country",
            "hosting_legal_entity",
            "legal_entity",
            "multimedia_urls",
            "networks",
            "participating_countries",
            "postal_code",
            "public_contacts",
            "region",
            "slug",
            "street_name_and_number",
            "updated_at",
            "webpage_url",
        )
