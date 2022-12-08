"""Transform services"""
from transform.schemas.unique_cols_name import (
    UNIQUE_OAG_AND_TRAINING_COLS,
    UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
)
from transform.transformers.base.marketplace import (
    MarketplaceBaseTransformer,
    SERVICE_TYPE,
)


class ServiceTransformer(MarketplaceBaseTransformer):
    """Service transformer"""
    def __init__(self, spark):
        self.type = SERVICE_TYPE
        id_increment = 0  # Do not change service ID
        super().__init__(id_increment, self.type, self.cols_to_add, self.cols_to_drop, spark)

    @property
    def cols_to_add(self) -> tuple[str, ...]:
        """Add those columns to the dataframe"""
        return (
            *UNIQUE_OAG_AND_TRAINING_COLS,
            *UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
        )

    @property
    def cols_to_drop(self) -> tuple[str, ...]:
        """Drop those columns from the dataframe"""
        return ("public_contacts",)
