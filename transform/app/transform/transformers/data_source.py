# pylint: disable=duplicate-code
"""Transform data sources"""
from pyspark.sql.types import (
    ArrayType,
    BooleanType,
    IntegerType,
    StringType,
    StructField,
    StructType,
)

from app.settings import settings
from app.transform.transformers.base.marketplace import MarketplaceBaseTransformer
from app.transform.utils.utils import sort_schema
from schemas.old.output.data_source import data_source_output_schema
from schemas.properties.data import (
    BEST_ACCESS_RIGHT,
    OPEN_ACCESS,
    PERSIST_ID_SYS_ENTITY_TYPE,
    PERSIST_ID_SYS_ENTITY_TYPE_SCHEMES,
    POPULARITY,
)


class DataSourceTransformer(MarketplaceBaseTransformer):
    """Data source transformer"""

    def __init__(self, spark):
        self.type = settings.DATASOURCE
        id_increment = settings.DATA_SOURCE_IDS_INCREMENTOR
        self.exp_output_schema = data_source_output_schema

        super().__init__(
            id_increment,
            self.type,
            self.cols_to_add,
            self.cols_to_drop,
            self.exp_output_schema,
            spark,
        )

    @property
    def harvested_schema(self) -> StructType:
        """Schema of harvested properties"""
        return sort_schema(
            StructType(
                [
                    StructField(BEST_ACCESS_RIGHT, StringType(), True),
                    StructField(OPEN_ACCESS, BooleanType(), True),
                    StructField(
                        PERSIST_ID_SYS_ENTITY_TYPE,
                        ArrayType(StringType()),
                        True,
                    ),
                    StructField(
                        PERSIST_ID_SYS_ENTITY_TYPE_SCHEMES,
                        ArrayType(ArrayType(StringType())),
                        True,
                    ),
                    StructField(POPULARITY, IntegerType(), True),
                ]
            )
        )

    @property
    def cols_to_add(self) -> None:
        """Add those columns to the dataframe"""
        return None

    @property
    def cols_to_drop(self) -> tuple[str, ...]:
        """Drop those columns from the dataframe"""
        return ("public_contacts",)
