# pylint: disable=line-too-long, wildcard-import, unused-wildcard-import, invalid-name, too-many-arguments
"""Transform Marketplace's resources"""
from abc import abstractmethod
from itertools import chain

from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.functions import col, lit
from pyspark.sql.types import StringType
from pyspark.sql.utils import AnalysisException

from app.settings import settings
from app.transform.transformers.base.base import BaseTransformer
from app.transform.utils.common import (
    create_open_access,
    harvest_popularity,
    map_best_access_right,
)
from schemas.properties.data import (
    ID,
    PERSIST_ID_SYS,
    PERSIST_ID_SYS_ENTITY_TYPE,
    PERSIST_ID_SYS_ENTITY_TYPE_SCHEMES,
    TYPE,
    UPSTREAM_ID,
    URL,
)


class MarketplaceBaseTransformer(BaseTransformer):
    """Transformer used to transform Marketplace's resources"""

    def __init__(
        self,
        id_increment: int,
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
        df = df.withColumn(
            "catalogue", self.get_first_element(df["catalogues"])
        )  # TODO delete
        df = df.withColumn(UPSTREAM_ID, col(UPSTREAM_ID).cast("bigint"))

        return df

    def apply_complex_trans(self, df: DataFrame) -> DataFrame:
        """Harvest oag properties that requires more complex transformations
        Basically from those harvested properties there will be created another dataframe
        which will be later on merged with the main dataframe"""
        df = map_best_access_right(df, self.harvested_properties, self.type)
        create_open_access(self.harvested_properties)
        harvest_popularity(df, self.harvested_properties)
        if self.type == settings.DATASOURCE:
            df = self.harvest_persistent_id_systems(df)

        return df

    def simplify_urls(self, df: DataFrame) -> DataFrame:
        """Simplify url columns - get only urls"""
        if self.type not in {settings.SERVICE, settings.DATASOURCE}:
            raise ValueError(
                f"{self.type=} not in the scope of {settings.SERVICE, settings.DATASOURCE}"
            )

        if self.type == settings.SERVICE:
            url_cols_to_simplify = ("multimedia_urls", "use_cases_urls")
        else:
            url_cols_to_simplify = (
                "multimedia_urls",
                "use_cases_urls",
                "research_product_metadata_license_urls",
                "research_product_licensing_urls",
            )

        for urls in url_cols_to_simplify:
            try:
                df = df.withColumn(urls, col(urls)[URL])
            except AnalysisException:
                df = df.withColumn(urls, lit(None))
        return df

    def harvest_persistent_id_systems(self, df: DataFrame) -> DataFrame:
        """
        1) Retrieve persistent_identity_systems.entity_type as arr[str, ...]
        2) Retrieve persistent_identity_systems.entity_type_schemes as arr[arr[str], ...]
        """
        try:
            persist_ids_collection = df.select(PERSIST_ID_SYS).collect()
        except AnalysisException:
            self.harvested_properties[PERSIST_ID_SYS_ENTITY_TYPE] = [None] * df.count()
            self.harvested_properties[PERSIST_ID_SYS_ENTITY_TYPE_SCHEMES] = [
                None
            ] * df.count()
            return df

        types_column = []
        schemas_column = []
        for persist_ids in chain.from_iterable(persist_ids_collection):
            types_row = []
            schemas_row = []
            for persist_id in persist_ids:
                types_row.append(persist_id["entity_type"])
                schemas_row.append(persist_id["entity_type_schemes"])
            types_column.append(types_row)
            schemas_column.append(schemas_row)

        self.harvested_properties[PERSIST_ID_SYS_ENTITY_TYPE] = types_column
        self.harvested_properties[PERSIST_ID_SYS_ENTITY_TYPE_SCHEMES] = schemas_column

        return df.drop(PERSIST_ID_SYS)

    @staticmethod
    def cast_columns(df: DataFrame) -> DataFrame:
        """Cast certain columns"""
        df = (
            df.withColumn("id", col("id").cast(StringType()))
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
