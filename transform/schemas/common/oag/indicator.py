from pydantic import BaseModel


class Indicator(BaseModel):
    """
    Model representing usage indicators.

    Attributes:
        usage_counts_downloads (str):
            The number of downloads.
        usage_counts_views (str):
            The number of views.
    """

    usage_counts_downloads: str
    usage_counts_views: str
