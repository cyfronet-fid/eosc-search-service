# pylint: disable=line-too-long, wildcard-import, invalid-name, unused-wildcard-import
"""Transform trainings"""
from pyspark.sql.functions import split
from pyspark.sql import SparkSession
from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    ArrayType,
    BooleanType,
    IntegerType,
)
from transform.transformations.common import *
from transform.transformers.base.base import BaseTransformer
from transform.utils.utils import sort_schema
from transform.schemas.properties_name import *
from transform.schemas.unique_cols_name import (
    UNIQUE_SERVICE_COLUMNS,
    UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
)


class TrainingTransformer(BaseTransformer):
    """Transformer used to transform training resources"""

    def __init__(self, spark: SparkSession):
        self.type = "training"
        # Increase the range of trainings IDs -> to avoid a conflict with service IDs
        self.id_increment = 1_000_000

        super().__init__(
            self.type, self.cols_to_add, self.cols_to_drop, self.cols_to_rename, spark
        )

    def apply_simple_trans(self, df: DataFrame) -> DataFrame:
        """Apply simple transformations.
        Simple in a way that there is a possibility to manipulate the main dataframe
        without a need to create another dataframe and merging"""
        df = df.withColumn(TYPE, lit(self.type))
        df = self.rename_cols(df)
        df = self.convert_ids(df, increment=self.id_increment)
        return df

    def apply_complex_trans(self, df: DataFrame) -> DataFrame:
        """Harvest oag properties that requires more complex transformations
        Basically from those harvested properties there will be created another dataframe
        which will be later on merged with the main dataframe"""
        df = map_best_access_right(df, self.harvested_properties, self.type)
        create_open_access(self.harvested_properties)
        df = map_language(df, self.harvested_properties)
        create_unified_categories(df, self.harvested_properties)
        df = remove_commas(df, "author_names", self.harvested_properties)

        return df

    @staticmethod
    def convert_ids(df: DataFrame, increment) -> DataFrame:
        """Increment dataframes IDs.
        Assumption: IDs are a digit whether as int, float or str
        Reason: Unfortunately, some resources have the same IDs"""
        int_ids = df.select(ID).collect()
        assert all((_id[ID].isdigit() for _id in int_ids)), "Not all IDs are a digit"

        return df.withColumn(
            ID, (col(ID) + increment).cast(IntegerType()).cast(StringType())
        )

    @staticmethod
    def cast_columns(df: DataFrame) -> DataFrame:
        """Cast trainings columns"""
        df = df.withColumn("description", split(col("description"), ","))
        df = transform_date(df, "publication_date", "yyyy-MM-dd")
        return df

    @property
    def harvested_schema(self):
        """Schema of harvested properties"""
        return sort_schema(
            StructType(
                [
                    StructField(AUTHOR_NAMES, ArrayType(StringType()), True),
                    StructField(BEST_ACCESS_RIGHT, StringType(), True),
                    StructField(LANGUAGE, ArrayType(StringType()), True),
                    StructField(OPEN_ACCESS, BooleanType(), True),
                    StructField(UNIFIED_CATEGORIES, ArrayType(StringType()), True),
                ]
            )
        )

    @property
    def cols_to_add(self) -> tuple[str, ...]:
        """Add those columns to the dataframe"""
        return (
            *UNIQUE_SERVICE_COLUMNS,
            *UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
            "author_pids",
            "contactgroup",
            "contactperson",
            "country",
            "document_type",
            "documentation_url",
            "doi",
            "fos",
            "format",
            "funder",
            "horizontal",
            "pid",
            "programming_language",
            "publisher",
            "relations",
            "relations_long",
            "research_community",
            "sdg",
            "size",
            "source",
            "subtitle",
            "tool",
            "usage_counts_downloads",
            "usage_counts_views",
            "version",
        )

    @property
    def cols_to_drop(self) -> tuple:
        """Drop those columns from the dataframe"""
        return ()

    @property
    def cols_to_rename(self) -> dict[str, str]:
        """Columns to rename. Keys are mapped to the values"""
        return {
            "Access_Rights_s": "best_access_right",
            "Author_ss": "author_names",
            "Content_Type_ss": "content_type",
            "Description_s": "description",
            "Duration_s": "duration",
            "EOSC_Provider_ss": "eosc_provider",
            "Keywords_ss": "keywords",
            "Language_ss": "language",
            "Level_of_expertise_s": "level_of_expertise",
            "License_s": "license",
            "Qualification_ss": "qualification",
            "Resource_Title_s": "title",
            "Resource_Type_ss": "resource_type",
            "Target_Group_ss": "target_group",
            "URL_ss": "url",
            "Version_Date_Created_In_s": "publication_date",
        }
