"""Interoperability Guideline expected db schema"""

from datetime import datetime
from typing import Dict, List

from pydantic import BaseModel


class GuidelineDBSchema(BaseModel):
    """
    Pydantic model representing the expected db schema for interoperability guideline.

    Attributes:
        alternative_ids (List):
            A list of alternative identifiers for the guideline.
        catalogues (str):
            The catalogue identifier for the guideline.
        publication_date (datetime):
            The date when the guideline was created (ISO 8601 format).
        creators (List):
            A list of creators of the guideline.
        description (str):
            A detailed description of the guideline.
        domain (str):
            The domain to which the guideline belongs.
        eosc_guideline_type (str):
            The type of the EOSC guideline.
        eosc_integration_options (List):
            A list of EOSC integration options for the guideline.
        id (str):
            Unique identifier for the guideline.
        identifierInfo (Dict):
            Information about the identifier of the guideline.
        providers (str):
            The provider identifier for the guideline.
        publication_year (int):
            The year the guideline was published.
        relatedStandards (List):
            A list of related standards for the guideline.
        resourceTypesInfo (List):
            Information about the types of resources associated with the guideline.
        rights (List):
            A list of rights associated with the guideline.
        status (str):
            The status of the guideline.
        title (str):
            The title of the guideline.
        type (str):
            Data type = "interoperability guideline".
        updated_at (datetime):
            The date when the guideline was last updated (ISO 8601 format).
    """

    # TODO make it more detailed
    alternative_ids: List
    catalogues: str
    publication_date: datetime
    creators: List
    description: str
    domain: str
    eosc_guideline_type: str
    eosc_integration_options: List
    id: str
    identifierInfo: Dict
    providers: str
    publication_year: int
    relatedStandards: List
    resourceTypesInfo: List
    rights: List
    status: str
    title: str
    type: str
    updated_at: datetime

    """
    Transformations necessary to convert GuidelineInputSchema to GuidelineDBSchema
        - add type = "interoperability guideline"
        - rename:
            "alternativeIdentifiers": "alternative_ids",
            "publicationYear": "publication_year",
            "catalogueId": "catalogues",
            "created": "publication_date",
            "updated": "updated_at",
            "eoscGuidelineType": "eosc_guideline_type",
            "eoscIntegrationOptions": "eosc_integration_options",
            "providerId": "providers",
    """
