"""Offers expected search engine schema"""

from datetime import date
from typing import List

from pydantic import BaseModel


class OfferSESchema(BaseModel):
    """
    Pydantic model representing the expected search engine schema for an offer after transformations.

    Attributes:
        best_access_right (str):
            The best access right for the offer.
        description (str):
            A detailed description of the offer.
        eosc_if (List[str]):
            # TODO add description
        eosc_if_tg (List[str]):
           The same data as 'eosc_if' but in solr text general type.
        id (str):
            Unique identifier for the offer.
        iid (int):
            Internal identifier for the offer.
        internal (bool):
            Indicates whether the offer is internal.
        open_access (bool):
            Indicates whether the offer is open access.
        popularity (int):
            Popularity score of the offer.
        publication_date (date):
            The date when the offer was published.
        service_id (int):
            Identifier for the service associated with the offer.
        status (str):
            The status of the offer.
        title (str):
            Title of the offer.
        type (str):
            Data type = "offer".
        updated_at (date):
            The date when the offer was last updated.
        usage_counts_downloads (int):
            The number of times the offer has been downloaded.
        usage_counts_views (int):
            The number of times the offer has been viewed.
        voucherable (bool):
            Indicates whether the offer is voucherable.
    """

    best_access_right: str
    description: str
    eosc_if: List[str]
    eosc_if_tg: List[str]
    id: str
    iid: int
    internal: bool
    open_access: bool
    popularity: int
    publication_date: date
    service_id: int
    status: str
    title: str
    type: str
    updated_at: date
    usage_counts_downloads: int
    usage_counts_views: int
    voucherable: bool

    """
    Transformations necessary to convert OfferInputSchema to OfferSESchema
        - add type = "offer"
        - add open_access
        - add popularity
        - rename:
            "name": "title",
            "order_type": "best_access_right",
        - offers are not exposed yet, but they will be so wait what will be used for filters, resource view etc.
    """
