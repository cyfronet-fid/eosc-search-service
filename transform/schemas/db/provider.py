"""Provider expected db schema"""

from datetime import datetime
from typing import List

from pydantic import AnyHttpUrl, BaseModel, EmailStr

from schemas.common.public_contact import PublicContact
from schemas.common.url import BasicURL


class ProviderDBSchema(BaseModel):
    """
    Pydantic model representing the expected db schema for a provider.

    Attributes:
        abbreviation (str):
            The abbreviation of the provider.
        affiliations (List[str]):
            A list of affiliations associated with the provider.
        areas_of_activity (List[str]):
            A list of areas of activity for the provider.
        catalogues (List[str]):
            A list of catalogues associated with the provider.
        certifications (List[str]):
            # TODO - Add description
        city (str):
            The city where the provider is located.
        country (List[str]):
            The country where the provider is based.
        description (str):
            A detailed description of the provider.
        esfri_domains (List[str]):
            A list of ESFRI domains associated with the provider.
        esfri_type (str):
            The ESFRI type of the provider.
        hosting_legal_entity (str):
            The legal entity hosting the provider.
        id (int):
            The unique identifier of the provider.
        legal_entity (bool):
            Indicates whether the provider is a legal entity.
        legal_status (str):
            The legal status of the provider.
        meril_scientific_domains (List[str]):
            A list of MERIL scientific domains associated with the provider.
        multimedia_urls (List[BasicURL]):
            A list of multimedia URLs related to the provider.
        national_roadmaps (List[str]):
            A list of national roadmaps associated with the provider.
        networks (List[str]):
            A list of networks associated with the provider.
        participating_countries (List[str]):
            A list of countries participating in the provider's activities.
        pid (str):
            The persistent identifier of the provider.
        popularity (int):
            Popularity score of the provider.
        postal_code (str):
            The postal code of the provider's location.
        life_cycle_status (str):
            The life cycle status of the provider.
        public_contacts (List[PublicContact]):
            A list of public contacts for the provider.
        publication_date (datetime):
            The date when the provider was published (ISO 8601 format).
        region (str):
            The region where the provider is located.
        scientific_domains (List[str]):
            A list of scientific domains associated with the provider.
        slug (str):
            The slug of the provider.
        societal_grand_challenges (List[str]):
            A list of societal grand challenges associated with the provider.
        street_name_and_number (str):
            The street name and number of the provider's location.
        structure_types (List[str]):
            A list of structure types associated with the provider.
        tag_list (List[str]):
            A list of tags categorizing the provider.
        title (str):
            The title of the provider.
        type (str):
            Data type = "provider".
        updated_at (datetime):
            The date when the provider was last updated (ISO 8601 format).
        usage_counts_downloads (int):
            The number of times the provider's resources have been downloaded.
        usage_counts_views (int):
            The number of times the provider's resources have been viewed.
        webpage_url (List[AnyHttpUrl]):
            The URL of the provider's webpage.
    """

    abbreviation: str
    affiliations: List[str]
    areas_of_activity: List[str]
    catalogues: List[str]
    certifications: List[str]
    city: str
    country: List[str]
    description: str
    esfri_domains: List[str]
    esfri_type: str
    hosting_legal_entity: str
    id: int
    legal_entity: bool
    legal_status: str
    meril_scientific_domains: List[str]
    multimedia_urls: List[BasicURL]
    national_roadmaps: List[str]
    networks: List[str]
    participating_countries: List[str]
    pid: str
    popularity: int
    postal_code: str
    life_cycle_status: str
    public_contacts: List[PublicContact]
    publication_date: datetime
    region: str
    scientific_domains: List[str]
    slug: str
    societal_grand_challenges: List[str]
    street_name_and_number: str
    structure_types: List[str]
    tag_list: List[str]
    title: str
    type: str
    updated_at: datetime
    usage_counts_downloads: int
    usage_counts_views: int
    webpage_url: List[AnyHttpUrl]

    """
    Transformations necessary to convert ProviderInputSchema to ProviderDBSchema
        - add type = "provider"
        - add popularity
        - rename:
            "language_availability": "language", # TODO there is no such a property in input schema
            "name": "title",
            "provider_life_cycle_status": "life_cycle_status",
        - cast:
            .withColumn("webpage_url", split(col("webpage_url"), ","))
            .withColumn("country", split(col("country"), ","))
            .withColumn("publication_date", col("publication_date").cast("date"))
            .withColumn("updated_at", col("updated_at").cast("date"))
    """
