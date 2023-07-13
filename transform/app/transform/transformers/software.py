"""Transform software"""
from app.transform.transformers.base.oag import OagBaseTransformer


class SoftwareTransformer(OagBaseTransformer):
    """Software transformer"""

    def __init__(self, spark):
        self.type = "software"
        super().__init__(self.type, self.cols_to_add, self.cols_to_drop, spark)

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
