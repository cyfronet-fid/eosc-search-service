"""Transform other research products"""
from transform.schemas.unique_cols_name import (
    UNIQUE_SERVICE_COLUMNS,
    UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
)
from transform.transformers.base.oag import OagBaseTransformer


class OtherRPTransformer(OagBaseTransformer):
    """Other research product transformer"""
    def __init__(self, spark):
        self.type = "other"
        super().__init__(self.type, self.cols_to_add, self.cols_to_drop, spark)

    @property
    def cols_to_add(self) -> tuple[str, ...]:
        """Add those columns to the dataframe"""
        return (
            *UNIQUE_SERVICE_COLUMNS,
            *UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
            "documentation_url",
            "programming_language",
            "subtitle",
            "size",
            "content_type",
            "duration",
            "eosc_provider",
            "format",
            "horizontal",
            "pid",
            "level_of_expertise",
            "license",
            "qualification",
            "resource_type",
            "target_group",
            "version",
        )

    @property
    def cols_to_drop(self) -> tuple[str, ...]:
        """Drop those columns from the dataframe"""
        return (
            "affiliation",
            "author",
            "context",
            "contributor",
            "country",
            "coverage",
            "dateofcollection",
            "embargoenddate",
            "eoscIF",
            "format",
            "indicator",
            "instance",
            "lastupdatetimestamp",
            "originalId",
            "projects",
            "pid",
            "subject",
        )