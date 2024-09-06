"""Provider expected search engine schema"""

from datetime import date
from typing import List

from pydantic import BaseModel


class ProviderSESchema(BaseModel):
    """
    Pydantic model representing the expected search engine schema for a provider after transformations.

    Attributes:
        abbreviation (str):
            The abbreviation of the provider. Used in resource view.
        areas_of_activity (List[str]):
            A list of areas of activity for the provider. Used in filters and tags.
        catalogue (str):
            # TODO move only to catalogues
            The catalogue associated with the provider.
        catalogues (List[str]):
            # TODO is it used?
            A list of catalogues associated with the provider.
        description (str):
            A detailed description of the provider. Used in searching.
        id (str):
            Unique identifier for the provider.
        legal_status (str):
            The legal status of the provider. Used in filters and tags.
        meril_scientific_domains (List[str]):
            # TODO add description. Used in filters and tags.
        pid (str):
            Persistent identifier for the provider. Used in resource view.
        popularity (int):
            Popularity score of the provider. Used in sorting.
        publication_date (date):
            The date when the provider's information was published. Used in sorting.
        scientific_domains (List[str]):
            A list of scientific domains associated with the provider. Used in filters and tags.
        slug (str):
            # TODO check if it is used
            The slug (URL-friendly identifier) for the provider.
        tag_list (List[str]):
            A list of tags categorizing the provider. Used in tags.
        tag_list_tg (List[str]):
            The same data as 'tag_list' but in solr text general type. Used in searching.
        title (str):
            The title of the provider. Used in searching.
        type (str):
            Data type = "provider". Used in routing and resource view.
        usage_counts_downloads (int):
            The number of times the provider's resources have been downloaded. Part of popularity.
        usage_counts_views (int):
            The number of times the provider's resources have been viewed. Part of popularity.
    """

    abbreviation: str
    areas_of_activity: List[str]
    catalogue: str  # TODO delete
    catalogues: List[str]
    description: str
    id: str
    legal_status: str
    meril_scientific_domains: List[str]
    pid: str
    popularity: int
    publication_date: date
    scientific_domains: List[str]
    slug: str
    tag_list: List[str]
    tag_list_tg: List[str]
    title: str
    type: str
    usage_counts_downloads: int
    usage_counts_views: int

    """
    Transformations necessary to convert ProviderInputSchema to ProviderSESchema
        - add type = "provider"
        - add popularity
        - delete:
            - affiliations
            - certifications
            - city
            - country
            - esfri_domains
            - esfri_type
            - hosting_legal_entity
            - legal_entity
            - life_cycle_status
            - multimedia_urls
            - national_roadmaps
            - networks
            - participating_countries
            - postal_code
            - region
            - societal_grand_challenges
            - street_name_and_number
            - structure_types
            - updated_at
            - webpage_url
            
        - rename:
            "language_availability": "language", # TODO there is no such a property in input schema
            "name": "title",
            "provider_life_cycle_status": "life_cycle_status",
        - cast:
            .withColumn("webpage_url", split(col("webpage_url"), ","))
            .withColumn("country", split(col("country"), ","))
            .withColumn("publication_date", col("publication_date").cast("date"))
            .withColumn("updated_at", col("updated_at").cast("date"))
        - apply current transformations if needed.
    """
