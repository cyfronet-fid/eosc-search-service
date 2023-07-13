"""Transform other research products"""
from transformers.base.oag import OagBaseTransformer


class OtherRPTransformer(OagBaseTransformer):
    """Other research product transformer"""

    def __init__(self, spark):
        self.type = "other"
        super().__init__(self.type, self.cols_to_add, self.cols_to_drop, spark)

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
