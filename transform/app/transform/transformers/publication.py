# pylint: disable=duplicate-code
"""Transform publications"""
from app.settings import settings
from app.transform.transformers.base.oag import OagBaseTransformer
from schemas.old.output.publication import publication_output_schema


class PublicationTransformer(OagBaseTransformer):
    """Publication transformer"""

    def __init__(self, spark):
        self.type = settings.PUBLICATION
        self.exp_output_schema = publication_output_schema
        super().__init__(
            self.type,
            self.cols_to_add,
            self.cols_to_drop,
            self.exp_output_schema,
            spark,
        )

    @property
    def cols_to_add(self) -> None:
        """Add those columns to the dataframe"""
        return None

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
