# pylint: disable=line-too-long, wildcard-import, unused-wildcard-import
"""Transform OAG resources"""
from abc import abstractmethod
from pyspark.sql import SparkSession
from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    ArrayType,
    BooleanType,
)
from transform.transformations.common import *
from transform.transformers.base.base import BaseTransformer
from transform.utils.utils import sort_schema


class OagBaseTransformer(BaseTransformer):
    """Transformer used to transform OAG resources"""

    def __init__(
        self,
        desired_type: str,
        cols_to_add: tuple[str, ...],
        cols_to_drop: tuple[str, ...],
        spark: SparkSession,
    ):
        super().__init__(
            desired_type, cols_to_add, cols_to_drop, self.cols_to_rename, spark
        )

    def apply_simple_trans(self, df: DataFrame) -> DataFrame:
        """Apply simple transformations.
        Simple in a way that there is a possibility to manipulate the main dataframe
        without a need to create another dataframe and merging"""
        check_type(df, desired_type=self.type)
        df = self.rename_cols(df)
        df = simplify_language(df)
        df = simplify_indicators(df)
        df = map_publisher(df)
        return df

    def apply_complex_trans(self, df: DataFrame) -> DataFrame:
        """Harvest oag properties that requires more complex transformations
        Basically from those harvested properties there will be created another dataframe
        which will be later on merged with the main dataframe"""
        df = map_best_access_right(df, self.harvested_properties, self.type)
        create_open_access(self.harvested_properties)
        df = map_language(df, self.harvested_properties)
        harvest_author_names_and_pids(df, self.harvested_properties)
        harvest_sdg_and_fos(df, self.harvested_properties)
        harvest_funder(df, self.harvested_properties)
        harvest_url_and_document_type(df, self.harvested_properties)
        harvest_doi(df, self.harvested_properties)
        harvest_country(df, self.harvested_properties)
        harvest_research_community(df, self.harvested_properties)
        harvest_relations(df, self.harvested_properties)
        create_unified_categories(df, self.harvested_properties)

        return df

    @property
    def harvested_schema(self) -> StructType:
        """Schema of harvested properties"""
        return sort_schema(
            StructType(
                [
                    StructField("author_names", ArrayType(StringType()), True),
                    StructField(
                        "author_pids", ArrayType(ArrayType(StringType())), True
                    ),
                    StructField("best_access_right", StringType(), True),
                    StructField("country", ArrayType(StringType()), True),
                    StructField("document_type", ArrayType(StringType()), True),
                    StructField("doi", ArrayType(StringType()), True),
                    StructField("fos", ArrayType(StringType()), True),
                    StructField("funder", ArrayType(StringType()), True),
                    StructField("language", ArrayType(StringType()), True),
                    StructField("open_access", BooleanType(), True),
                    StructField("relations", ArrayType(StringType()), True),
                    StructField("relations_long", ArrayType(StringType()), True),
                    StructField("research_community", ArrayType(StringType()), True),
                    StructField("sdg", ArrayType(StringType()), True),
                    StructField("unified_categories", ArrayType(StringType()), True),
                    StructField("url", ArrayType(StringType()), True),
                ]
            )
        )

    @staticmethod
    def cast_columns(df: DataFrame) -> DataFrame:
        """Cast certain OAG columns"""
        df = transform_date(df, "publication_date", "yyyy-MM-dd")

        return df

    @property
    def cols_to_rename(self) -> dict[str, str]:
        """Columns to rename. Keys are mapped to the values"""
        return {
            "bestaccessright": "best_access_right",
            "documentationUrl": "documentation_url",
            "programmingLanguage": "programming_language",
            "publicationdate": "publication_date",
            "maintitle": "title",
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
