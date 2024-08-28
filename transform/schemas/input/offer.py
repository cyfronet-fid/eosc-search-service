"""Offers expected input schema"""

from datetime import datetime
from typing import Dict, List, Union

from pydantic import BaseModel


class ParameterConfig(BaseModel):
    """
    Model representing the configuration of a parameter.

    Attributes:
        exclusiveMaximum (bool):
            Indicates whether the parameter has an exclusive maximum value.
        exclusiveMinimum (bool):
            Indicates whether the parameter has an exclusive minimum value.
        maxItems (int):
            The maximum number of items for the parameter.
        maximum (int):
            The maximum value for the parameter.
        minItems (int):
            The minimum number of items for the parameter.
        minimum (int):
            The minimum value for the parameter.
        mode (str):
            The mode of the parameter.
        values (List[str]):
            The list of possible values for the parameter.
    """

    exclusiveMaximum: bool
    exclusiveMinimum: bool
    maxItems: int
    maximum: int
    minItems: int
    minimum: int
    mode: str
    values: List[str]


class Parameter(BaseModel):
    """
    Model representing a parameter.

    Attributes:
        config (ParameterConfig):
            The configuration of the parameter.
        description (str):
            The description of the parameter.
        id (str):
            The unique identifier of the parameter.
        label (str):
            The label of the parameter.
        type (str):
            The type of the parameter.
        unit (str):
            The unit of the parameter.
        value (str):
            The value of the parameter.
        value_type (str):
            The type of the parameter value.
    """

    config: ParameterConfig
    description: str
    id: str
    label: str
    type: str
    unit: str
    value: str
    value_type: str


class OfferInputSchema(BaseModel):
    """
    Pydantic model representing the expected input schema for an offer.

    Attributes:
        description (str):
            A detailed description of the offer.
        eosc_if (List[str]):
            # TODO - Add description
        id (int):
            The unique identifier of the offer.
        iid (int):
            The internal identifier of the offer.
        internal (bool):
            Indicates whether the offer is internal.
        name (str):
            The name of the offer.
        order_type (str):
            The type of order for the offer.
        parameters (List[Parameter]):
            A list of offer parameters.
        publication_date (datetime):
            The date when the offer was published (ISO 8601 format).
        service_id (int):
            The identifier of the service associated with the offer.
        status (str):
            The status of the offer.
        tag_list (List[str]):
            A list of tags associated with the offer.
        updated_at (datetime):
            The date when the offer was last updated (ISO 8601 format).
        usage_counts_downloads (int):
            The number of times the offer has been downloaded.
        usage_counts_views (int):
            The number of times the offer has been viewed.
        voucherable (bool):
            Indicates whether the offer is voucherable.
    """

    description: str
    eosc_if: List[str]
    id: int
    iid: int
    internal: bool
    name: str
    order_type: str
    parameters: List[Parameter]
    publication_date: datetime
    service_id: int
    status: str
    tag_list: List[str]
    updated_at: datetime
    usage_counts_downloads: int
    usage_counts_views: int
    voucherable: bool
