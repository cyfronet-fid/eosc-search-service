"""Transform publications"""
from transform.schemas.unique_cols_name import (
    UNIQUE_SERVICE_COLUMNS,
    UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
    UNIQUE_GUIDELINES_COLS,
)
from transform.transformers.base.oag import OagBaseTransformer


class PublicationTransformer(OagBaseTransformer):
    """Publication transformer"""

    def __init__(self, spark):
        self.type = "publication"
        super().__init__(self.type, self.cols_to_add, self.cols_to_drop, spark)

    @property
    def cols_to_add(self) -> tuple[str, ...]:
        """Add those columns to the dataframe"""
        return (
            *UNIQUE_SERVICE_COLUMNS,
            *UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
            *UNIQUE_GUIDELINES_COLS,
            "catalogue",
            "contactgroup",
            "contactperson",
            "documentation_url",
            "programming_language",
            "size",
            "version",
            "content_type",
            "duration",
            "eosc_provider",
            "horizontal",
            "geographical_availabilities",
            "pid",
            "learning_outcomes",
            "level_of_expertise",
            "license",
            "qualification",
            "related_services",
            "resource_type",
            "scientific_domains",
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
            "container",
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
            "relations",
            "subject",
        )
