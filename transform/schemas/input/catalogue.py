"""Catalogue expected input schema"""

from datetime import datetime
from typing import List, Optional

from pydantic import AnyHttpUrl, BaseModel

from schemas.common.public_contact import PublicContact
from schemas.common.url import BasicURL


class CatalogueInputSchema(BaseModel):
    """
    Pydantic model representing the expected input schema for a catalogue.

    Attributes:
        abbreviation (str):
            The abbreviation of the catalogue.
        affiliations (Optional[List[str]]):
            A list of affiliations associated with the catalogue.
        city (Optional[str]):
            The city where the catalogue is located.
        country (Optional[str]):
            The country where the catalogue is based.
        created_at (Optional[datetime]):
            The date and time when the catalogue was created (ISO 8601 format).
        description (str):
            A detailed description of the catalogue.
        hosting_legal_entity (Optional[str]):
            The legal entity hosting the catalogue.
        id (Optional[int]):
            Unique identifier for the catalogue.
        legal_entity (Optional[bool]):
            Indicates whether the catalogue is a legal entity.
        legal_status (Optional[str]):
            The legal status of the catalogue.
        multimedia_urls (Optional[List[schemas.common.url.BasicURL]]):
            A list of multimedia URLs related to the catalogue.
        name (str):
            The name of the catalogue.
        networks (Optional[List[str]]):
            A list of networks associated with the catalogue.
        participating_countries (Optional[List[str]]):
            A list of countries participating in the catalogue.
        pid (str):
            Persistent identifier for the catalogue.
        postal_code (Optional[str]):
            The postal code of the catalogue's location.
        public_contacts (Optional[List[PublicContact]]):
            A list of public contacts for the catalogue.
        region (Optional[str]):
            The region where the catalogue is located.
        scientific_domains (Optional[List[str]]):
            A list of scientific domains associated with the catalogue.
        slug (Optional[str]):
            A URL-friendly slug for the catalogue.
        street_name_and_number (Optional[str]):
            The street name and number of the catalogue's location.
        tag_list (List[str]):
            A list of tags categorizing the catalogue.
        updated_at (Optional[datetime]):
            The date and time when the catalogue was last updated (ISO 8601 format).
        webpage_url (Optional[AnyHttpUrl]):
            The URL of the catalogue's webpage.
        publication_date (datetime):
            The date when the catalogue was published (ISO 8601 format).
    """

    abbreviation: str
    affiliations: Optional[List[str]]
    city: Optional[str]
    country: Optional[str]
    created_at: Optional[datetime]
    description: str
    hosting_legal_entity: Optional[str]
    id: Optional[int]
    legal_entity: Optional[bool]
    legal_status: Optional[str]
    multimedia_urls: Optional[List[BasicURL]]
    name: str
    networks: Optional[List[str]]
    participating_countries: Optional[List[str]]
    pid: str
    postal_code: Optional[str]
    public_contacts: Optional[List[PublicContact]]
    region: Optional[str]
    scientific_domains: Optional[List[str]]
    slug: Optional[str]
    street_name_and_number: Optional[str]
    tag_list: List[str]
    updated_at: Optional[datetime]
    webpage_url: Optional[AnyHttpUrl]
    publication_date: datetime
