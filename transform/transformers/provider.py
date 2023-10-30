# pylint: disable=line-too-long, wildcard-import, unused-wildcard-import, invalid-name
"""Transform Marketplace's resources"""
import os
from tqdm import tqdm
from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    split,
)
from pyspark.sql.types import StringType, StructType, StructField, IntegerType
from transformations.common import *
from transformers.base.base import BaseTransformer
from schemas.properties.data import ID, POPULARITY
from utils.loader import (
    load_data,
)
from schemas.properties.env import (
    PROVIDER,
    OUTPUT_FORMAT,
    OUTPUT_PATH,
    OUTPUT_SCHEMA,
    SEPARATE_COLLECTION,
    PATH,
)
from utils.utils import print_errors
from utils.send import (
    send_data,
    failed_files,
)
from utils.save import save_df
from conf.logger import Log4J
from utils.validate import (
    check_schema_after_trans,
)
from utils.utils import sort_schema


PROVIDER_TYPE = "provider"


class ProviderTransformer(BaseTransformer):
    """Transformer used to transform providers"""

    def __init__(self, spark: SparkSession):
        self.type = PROVIDER_TYPE
        # Increase the range of providers IDs -> to avoid a conflicts
        self.id_increment = 100_000
        super().__init__(
            self.type, self.cols_to_add, self.cols_to_drop, self.cols_to_rename, spark
        )

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
            df = df.withColumn(urls, col(urls)[URL])
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
            df.withColumn("description", split(col("description"), ","))
            .withColumn("webpage_url", split(col("webpage_url"), ","))
            .withColumn("country", split(col("country"), ","))
            .withColumn("id", col("id").cast(StringType()))
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


def upload_providers(env_vars: dict, spark: SparkSession, logger: Log4J) -> None:
    """Upload providers to the separate collection"""
    provider_input_dir = env_vars[SEPARATE_COLLECTION][PROVIDER][PATH]
    provider_output_schema = env_vars[SEPARATE_COLLECTION][PROVIDER][OUTPUT_SCHEMA]
    files = sorted(os.listdir(provider_input_dir))

    for file_num, file in enumerate(tqdm(files, desc=PROVIDER)):
        file_path = os.path.join(provider_input_dir, file)
        df = load_data(spark, file_path, PROVIDER)

        # Transform
        try:
            df_trans = ProviderTransformer(spark)(df)
        except (ValueError, AssertionError, KeyError):
            print_errors("transform_fail", failed_files, PROVIDER, file, logger)
            continue

        try:
            check_schema_after_trans(
                df_trans, provider_output_schema, collection="Provider"
            )
        except AssertionError:
            print_errors("consistency_fail", failed_files, PROVIDER, file, logger)
            continue

        save_df(
            df_trans,
            PROVIDER,
            env_vars[OUTPUT_PATH],
            logger,
            _format=env_vars[OUTPUT_FORMAT],
        )

        send_data(env_vars, PROVIDER, file, file_num)
