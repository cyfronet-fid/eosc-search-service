# pylint: disable=duplicate-code
"""Transform other research products"""
from app.settings import settings
from app.transform.transformers.base.oag import OagBaseTransformer
from schemas.old.output.other_rp import other_rp_output_schema


class OtherRPTransformer(OagBaseTransformer):
    """Other research product transformer"""

    def __init__(self, spark):
        self.type = settings.OTHER_RP
        self.exp_output_schema = other_rp_output_schema

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
