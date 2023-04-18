"""Transform data sources"""
from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    BooleanType,
    ArrayType,
)
from transform.transformers.base.marketplace import (
    MarketplaceBaseTransformer,
    DATA_SOURCE_TYPE,
)
from transform.utils.utils import sort_schema
from transform.schemas.properties_name import (
    PERSIST_ID_SYS_ENTITY_TYPE,
    PERSIST_ID_SYS_ENTITY_TYPE_SCHEMES,
    BEST_ACCESS_RIGHT,
    OPEN_ACCESS,
)


class DataSourceTransformer(MarketplaceBaseTransformer):
    """Data source transformer"""

    def __init__(self, spark):
        self.type = DATA_SOURCE_TYPE
        id_increment = 10_000_000
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
