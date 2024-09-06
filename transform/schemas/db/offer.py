"""Offers expected db schema"""

from datetime import datetime
from typing import List

from pydantic import BaseModel

from schemas.input.offer import Parameter


class OfferDBSchema(BaseModel):
    """
    Pydantic model representing the expected db schema for an offer.

    Attributes:
        best_access_right (str):
            The best access right for the offer.
        description (str):
            A detailed description of the offer.
        eosc_if (List[str]):
            TODO - Add description
        id (int):
            The unique identifier of the offer.
        iid (int):
            The internal identifier of the offer.
        internal (bool):
            Indicates whether the offer is internal.
        open_access (bool):
            Indicates whether the offer is open access.
        parameters (List[Parameter]):
            A list of offer parameters.
        popularity (int):
            Popularity score of the offer.
        publication_date (datetime):
            The date when the offer was published (ISO 8601 format).
        service_id (int):
            The identifier of the service associated with the offer.
        status (str):
            The status of the offer.
        tag_list (List[str]):
            A list of tags associated with the offer.
        title (str):
            Title of the offer.
        type (str):
            Data type = "offer".
        updated_at (datetime):
            The date when the offer was last updated (ISO 8601 format).
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
    id: int
    iid: int
    internal: bool
    open_access: bool
    parameters: List[Parameter]
    popularity: int
    publication_date: datetime
    service_id: int
    status: str
    tag_list: List[str]  # TODO is it passed & used?
    title: str
    type: str
    updated_at: datetime
    usage_counts_downloads: int
    usage_counts_views: int
    voucherable: bool

    """
    Transformations necessary to convert OfferInputSchema to OfferDBSchema
        - add type = "offer"
        - add open_access
        - add popularity
        - rename:
            "name": "title",
            "order_type": "best_access_right",
    """
