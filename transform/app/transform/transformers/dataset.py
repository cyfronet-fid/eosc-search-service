# pylint: disable=duplicate-code
"""Transform datasets"""
from app.settings import settings
from app.transform.transformers.base.oag import OagBaseTransformer
from schemas.old.output.dataset import dataset_output_schema


class DatasetTransformer(OagBaseTransformer):
    """Dataset transformer"""

    def __init__(self, spark):
        self.type = settings.DATASET
        self.exp_output_schema = dataset_output_schema

        super().__init__(
            self.type,
            self.cols_to_add,
            self.cols_to_drop,
            self.exp_output_schema,
            spark,
        )

    @property
    def cols_to_add(self) -> tuple[str, ...]:
        """Add those columns to the dataframe"""
        return ("subtitle",)

    @property
    def cols_to_drop(self) -> tuple[str, ...]:
        """Drop those columns from the dataframe"""
        return (
            "affiliation",
            "author",
            "collectedfrom",
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
            "relations",
            "subject",
        )
