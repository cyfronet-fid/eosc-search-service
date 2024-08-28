"""Interoperability Guideline expected input schema"""

from datetime import datetime
from typing import Dict, List

from pydantic import BaseModel


class GuidelineInputSchema(BaseModel):
    """
    Pydantic model representing the expected input schema for a interoperability guideline.

    Attributes:
        alternativeIdentifiers (Listń):
            A list of alternative identifiers for the guideline.
        catalogueId (str):
            The catalogue identifier for the guideline.
        created (datetime):
            The date when the guideline was created (ISO 8601 format).
        creators (List):
            A list of creators of the guideline.
        description (str):
            A detailed description of the guideline.
        domain (str):
            The domain to which the guideline belongs.
        eoscGuidelineType (str):
            The type of the EOSC guideline.
        eoscIntegrationOptions (List):
            A list of EOSC integration options for the guideline.
        id (str):
            Unique identifier for the guideline.
        identifierInfo (Dict):
            Information about the identifier of the guideline.
        providerId (str):
            The provider identifier for the guideline.
        publicationYear (int):
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
        updated (datetime):
            The date when the guideline was last updated (ISO 8601 format).
    """

    # TODO make it more detailed
    alternativeIdentifiers: List
    catalogueId: str
    created: datetime
    creators: List
    description: str
    domain: str
    eoscGuidelineType: str
    eoscIntegrationOptions: List
    id: str
    identifierInfo: Dict
    providerId: str
    publicationYear: int
    relatedStandards: List
    resourceTypesInfo: List
    rights: List
    status: str
    title: str
    updated: datetime
