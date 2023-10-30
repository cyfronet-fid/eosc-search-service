"""Transform services"""
from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    BooleanType,
    IntegerType,
)
from transformers.base.marketplace import (
    MarketplaceBaseTransformer,
    SERVICE_TYPE,
)
from utils.utils import sort_schema
from schemas.properties.data import BEST_ACCESS_RIGHT, OPEN_ACCESS, POPULARITY


class ServiceTransformer(MarketplaceBaseTransformer):
    """Service transformer"""

    def __init__(self, spark):
        self.type = SERVICE_TYPE
        id_increment = 0  # Do not change service ID
        super().__init__(
            id_increment, self.type, self.cols_to_add, self.cols_to_drop, spark
        )

    @property
    def harvested_schema(self) -> StructType:
        """Schema of harvested properties"""
        return sort_schema(
            StructType(
                [
                    StructField(BEST_ACCESS_RIGHT, StringType(), True),
                    StructField(OPEN_ACCESS, BooleanType(), True),
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
