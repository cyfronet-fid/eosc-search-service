# pylint: disable=duplicate-code
"""Transform services"""
from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    BooleanType,
    IntegerType,
)
from app.transform.transformers.base.marketplace import (
    MarketplaceBaseTransformer,
    SERVICE_TYPE,
)
from app.transform.utils.utils import sort_schema
from app.transform.schemas.properties_name import (
    BEST_ACCESS_RIGHT,
    OPEN_ACCESS,
    POPULARITY,
)

SERVICE_IDS_INCREMENTOR = 0


class ServiceTransformer(MarketplaceBaseTransformer):
    """Service transformer"""

    def __init__(self, spark):
        self.type = SERVICE_TYPE
        id_increment = SERVICE_IDS_INCREMENTOR  # Do not change service ID
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
