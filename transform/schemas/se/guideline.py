"""Guideline expected search engine schema"""

from datetime import datetime
from typing import List

from pydantic import BaseModel


class GuidelineSESchema(BaseModel):
    """
    Pydantic model representing the expected search engine schema for a interoperability guideline after transformations.

    Attributes:
        alternative_ids (str):
            Alternative identifiers for the guideline.
        author_affiliations (List[str]):
            A list of author affiliations.
        author_affiliations_id (List[str]):
            A list of author affiliation IDs.
        author_family_names (List[str]):
            A list of author family names.
        author_given_names (List[str]):
            A list of author given names.
        author_names (List[str]):
            A list of author names.
        author_names_id (List[str]):
            A list of author name IDs.
        author_names_tg (List[str]):
            A list of target group author names, the same data as 'author_names' but in text general type.
        author_types (List[str]):
            A list of author types.
        catalogue (str):
            The catalogue associated with the guideline.
        catalogues (List[str]):
            A list of catalogues associated with the guideline.
        creators (str):
            The creators of the guideline.
        description (List[str]):
            A list of descriptions for the guideline.
        doi (List[str]):
            A list of DOIs (Digital Object Identifiers) for the guideline.
        domain (str):
            The domain of the guideline.
        eosc_guideline_type (str):
            The type of EOSC guideline.
        eosc_integration_options (List[str]):
            A list of EOSC integration options.
        id (str):
            Unique identifier for the guideline.
        provider (str):  # TODO delete
            The provider associated with the guideline.
        providers (List[str]):
            A list of providers associated with the guideline.
        publication_date (datetime):
            The date when the guideline was published.
        publication_year (int):
            The year when the guideline was published.
        related_standards_id (List[str]):
            A list of related standards IDs.
        related_standards_uri (List[str]):
            A list of related standards URIs.
        right_id (List[str]):
            A list of rights IDs.
        right_title (List[str]):
            A list of rights titles.
        right_uri (List[str]):
            A list of rights URIs.
        status (str):
            The status of the guideline.
        title (List[str]):
            A list of titles for the guideline.
        type (str):
            Data type = "interoperability guideline".
        type_general (List[str]):
            A list of general types for the guideline.
        type_info (List[str]):
            A list of type information for the guideline.
        updated_at (datetime):
            The date and time when the guideline was last updated.
        uri (List[str]):
            A list of URIs for the guideline.
    """

    alternative_ids: str
    author_affiliations: List[str]
    author_affiliations_id: List[str]
    author_family_names: List[str]
    author_given_names: List[str]
    author_names: List[str]
    author_names_id: List[str]
    author_names_tg: List[str]
    author_types: List[str]
    catalogue: str  # TODO delete
    catalogues: List[str]
    creators: str
    description: List[str]
    doi: List[str]
    domain: str
    eosc_guideline_type: str
    eosc_integration_options: List[str]
    id: str
    provider: str  # TODO delete
    providers: List[str]
    publication_date: datetime
    publication_year: int
    related_standards_id: List[str]
    related_standards_uri: List[str]
    right_id: List[str]
    right_title: List[str]
    right_uri: List[str]
    status: str
    title: List[str]
    type: str
    type_general: List[str]
    type_info: List[str]
    updated_at: datetime
    uri: List[str]

    """
    Transformations necessary to convert GuidelineInputSchema to GuidelineSESchema
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
        - for now lets keep those variables as they are, refactor backend/frontend to use data from the db and then change schema kept in SE
        
    """
