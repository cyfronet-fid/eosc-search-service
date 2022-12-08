"""Transform datasets"""
from transform.schemas.unique_cols_name import (
    UNIQUE_SERVICE_COLUMNS,
    UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
)
from transform.transformers.base.oag import OagBaseTransformer


class DatasetTransformer(OagBaseTransformer):
    """Dataset transformer"""
    def __init__(self, spark):
        self.type = "dataset"
        super().__init__(self.type, self.cols_to_add, self.cols_to_drop, spark)

    @property
    def cols_to_add(self) -> tuple[str, ...]:
        """Add those columns to the dataframe"""
        return (
            *UNIQUE_SERVICE_COLUMNS,
            *UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
            "contactgroup",
            "contactperson",
            "documentation_url",
            "programming_language",
            "subtitle",
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
            "tool",
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
            "geolocation",
            "format",
            "indicator",
            "instance",
            "lastupdatetimestamp",
            "originalId",
            "projects",
            "pid",
            "subject",
        )
