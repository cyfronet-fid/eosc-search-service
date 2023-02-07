"""Transform data sources"""
from transform.schemas.unique_cols_name import (
    UNIQUE_OAG_AND_TRAINING_COLS,
    UNIQUE_SERVICE_COLS_FOR_DATA_SOURCE,
)
from transform.transformers.base.marketplace import (
    MarketplaceBaseTransformer,
    DATA_SOURCE_TYPE,
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
    def cols_to_add(self) -> tuple[str, ...]:
        """Add those columns to the dataframe"""
        return (
            *UNIQUE_OAG_AND_TRAINING_COLS,
            *UNIQUE_SERVICE_COLS_FOR_DATA_SOURCE,
        )

    @property
    def cols_to_drop(self) -> tuple[str, ...]:
        """Drop those columns from the dataframe"""
        return ("public_contacts",)
