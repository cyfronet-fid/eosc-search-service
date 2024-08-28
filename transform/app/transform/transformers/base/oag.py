# pylint: disable=line-too-long, wildcard-import, unused-wildcard-import
"""Transform OAG resources"""
from abc import abstractmethod

from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.functions import array, col, lit, year
from pyspark.sql.types import (
    ArrayType,
    BooleanType,
    IntegerType,
    StringType,
    StructField,
    StructType,
)

from app.transform.transformers.base.base import BaseTransformer
from app.transform.utils.common import (
    check_type,
    create_open_access,
    create_unified_categories,
    harvest_author_names_and_pids,
    harvest_country,
    harvest_data_source,
    harvest_eosc_if,
    harvest_exportation,
    harvest_funder,
    harvest_pids,
    harvest_popularity,
    harvest_project_ids,
    harvest_related_organisations,
    harvest_relations,
    harvest_research_community,
    harvest_scientific_domains,
    harvest_sdg,
    harvest_url_and_document_type,
    map_best_access_right,
    map_language,
    map_publisher,
    simplify_indicators,
    simplify_language,
    transform_date,
)
from app.transform.utils.utils import sort_schema
from schemas import *
from schemas.properties.data import *


class OagBaseTransformer(BaseTransformer):
    """Transformer used to transform OAG resources"""

    def __init__(
        self,
        desired_type: str,
        cols_to_add: tuple[str, ...] | None,
        cols_to_drop: tuple[str, ...] | None,
        exp_output_schema: dict,
        spark: SparkSession,
    ):
        super().__init__(
            desired_type,
            cols_to_add,
            cols_to_drop,
            self.cols_to_rename,
            exp_output_schema,
            spark,
        )
        self.catalogue = "eosc"

    def apply_simple_trans(self, df: DataFrame) -> DataFrame:
        """Apply simple transformations.
        Simple in a way that there is a possibility to manipulate the main dataframe
        without a need to create another dataframe and merging"""
        check_type(df, desired_type=self.type)
        df = df.withColumn("catalogues", array(lit(self.catalogue)))
        df = df.withColumn("catalogue", lit(self.catalogue))  # TODO delete
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
        harvest_scientific_domains(df, self.harvested_properties)
        harvest_sdg(df, self.harvested_properties)
        harvest_funder(df, self.harvested_properties)
        harvest_url_and_document_type(df, self.harvested_properties)
        harvest_pids(df, self.harvested_properties)
        harvest_country(df, self.harvested_properties)
        harvest_research_community(df, self.harvested_properties)
        harvest_relations(df, self.harvested_properties)
        harvest_eosc_if(df, self.harvested_properties)
        harvest_popularity(df, self.harvested_properties)
        create_unified_categories(df, self.harvested_properties)
        harvest_exportation(df, self.harvested_properties)
        harvest_data_source(df, self.harvested_properties)
        harvest_related_organisations(df, self.harvested_properties)
        harvest_project_ids(df, self.harvested_properties)

        return df

    @property
    def harvested_schema(self) -> StructType:
        """Schema of harvested properties"""
        return sort_schema(
            StructType(
                [
                    StructField(AUTHOR_NAMES, ArrayType(StringType()), True),
                    StructField(AUTHOR_PIDS, ArrayType(ArrayType(StringType())), True),
                    StructField(BEST_ACCESS_RIGHT, StringType(), True),
                    StructField(COUNTRY, ArrayType(StringType()), True),
                    StructField(DATA_SOURCE, ArrayType(StringType()), True),
                    StructField(DOCUMENT_TYPE, ArrayType(StringType()), True),
                    StructField(DOI, ArrayType(StringType()), True),
                    StructField(EOSC_IF, ArrayType(StringType()), True),
                    StructField(EXPORTATION, ArrayType(StringType()), True),
                    StructField(FUNDER, ArrayType(StringType()), True),
                    StructField(LANGUAGE, ArrayType(StringType()), True),
                    StructField(OPEN_ACCESS, BooleanType(), True),
                    StructField(PIDS, StringType(), True),
                    StructField(POPULARITY, IntegerType(), True),
                    StructField(
                        RELATED_ORGANISATION_TITLES, ArrayType(StringType()), True
                    ),
                    StructField(RELATED_PROJECT_IDS, ArrayType(StringType()), True),
                    StructField(RELATIONS, ArrayType(StringType()), True),
                    StructField(RELATIONS_LONG, ArrayType(StringType()), True),
                    StructField(RESEARCH_COMMUNITY, ArrayType(StringType()), True),
                    StructField(SCIENTIFIC_DOMAINS, ArrayType(StringType()), True),
                    StructField(SDG, ArrayType(StringType()), True),
                    StructField(UNIFIED_CATEGORIES, ArrayType(StringType()), True),
                    StructField(URL, ArrayType(StringType()), True),
                ]
            )
        )

    @staticmethod
    def cast_columns(df: DataFrame) -> DataFrame:
        """Cast certain OAG columns"""
        df = transform_date(df, "publication_date", "yyyy-MM-dd")
        df = df.withColumn("publication_year", year(col("publication_date")))

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
            "fulltext": "direct_url",
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
