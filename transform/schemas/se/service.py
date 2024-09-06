"""Service expected search engine schema"""

from datetime import date
from typing import List

from pydantic import AnyHttpUrl, BaseModel, EmailStr


class ServiceSESchema(BaseModel):
    """
    Pydantic model representing the expected search engine schema for a service after transformations.

    Attributes:
        best_access_right (str):
            The best access right for the service. Used in filters.
        catalogue (str):
            # TODO move only to catalogues
            The catalogue associated with the service.
        catalogues (List[str]):
            # TODO is it used?
            A list of catalogues associated with the service.
        categories (List[str]):
            A list of categories applicable to the service. Used in filters.
        dedicated_for (List[str]):
            A list of dedicated purposes for the service. Used in filters.
        description (str):
            A detailed description of the service. Used in searching.
        eosc_if (List[str]):
            TODO add description. Used in filters and secondary tags.
        eosc_if_tg (List[str]):
            The same data as 'eosc_if' but in solr text general type. Used in searching.
        guidelines (List[str]):
            A list of guidelines available for this service. Used in filters and tags.
        geographical_availabilities (List[str]):
            A list of geographical locations where the service is available. Used in filters.
        horizontal (bool):
            Indicates whether the service is horizontal. Used in filters and resource view.
        id (str):
            Unique identifier for the service.
        language (List[str]):
            A list of languages in which the service is available. Used in filters and resource view.
        open_access (bool):
            # TODO is it used?
            Indicates whether the service is open access.
        pid (str):
            Persistent identifier for the service. Used in resource view.
        platforms (List[str]):
            A list of platforms where the service is available. Used in filers.
        popularity (int):
            Popularity score of the service. Used in sorting.
        providers (List[str]):
            A list of providers associated with the service. Used in filters.
        publication_date (date):
            The date when the service was published. Used in sorting.
        rating (str):
            The rating of the service. Used in filters.
        resource_organisation (str):
            The organisation responsible for the service. Used in filters.
        scientific_domains (List[str]):
            A list of scientific domains associated with the service. Used in filters and tags.
        slug (str):
            # TODO is it used?
            The slug (URL-friendly identifier) for the service.
        tag_list (List[str]):
            A list of tags categorizing the service. Used in secondary tags.
        tag_list_tg (List[str]):
            The same data as 'tag_list' but in solr text general type. Used in searching.
        title (str):
            The title of the service. Used in searching.
        type (str):
            Data type = "service". Used in routing and resource view.
        unified_categories (List[str]):
            A list of unified categories for the service. Used in filters.
        usage_counts_downloads (int):
            The number of times the service has been downloaded. Part of popularity.
        usage_counts_views (int):
            The number of times the service has been viewed. Part of popularity.
    """

    best_access_right: str
    catalogue: str  # TODO delete
    catalogues: List[str]
    categories: List[str]
    dedicated_for: List[str]
    description: str
    eosc_if: List[str]
    eosc_if_tg: List[str]
    guidelines: List[str]
    geographical_availabilities: List[str]
    horizontal: bool
    id: str
    language: List[str]
    open_access: bool
    pid: str
    platforms: List[str]
    popularity: int
    providers: List[str]
    publication_date: date
    rating: str
    resource_organisation: str
    scientific_domains: List[str]
    slug: str
    tag_list: List[str]
    tag_list_tg: List[str]
    title: str
    type: str
    unified_categories: List[str]
    usage_counts_downloads: int
    usage_counts_views: int

    """
    Transformations necessary to convert ServiceInputSchema to ServiceSESchema
        - add type = "service"
        - delete: 
            - abbreviation
            - access_modes
            - access_policies_url
            - access_types
            - activate_message
            - certifications
            - changelog
            - funding_bodies
            - funding_programs
            - grant_project_names
            - helpdesk_email
            - helpdesk_url
            - last_update
            - life_cycle_status
            - maintenance_url
            - manual_url
            - multimedia_urls
            - offers_count
            - open_source_technologies
            - order_url
            - payment_model_url
            - phase
            - pricing_url
            - privacy_policy_url
            - related_platforms
            - resource_geographic_locations
            - restrictions
            - security_contact_email
            - service_opinion_count
            - sla_url
            - standards
            - status
            - status_monitoring_url
            - synchronized_at
            - tagline
            - terms_of_use_url
            - training_information_url
            - trl
            - updated_at
            - upstream_id
            - use_cases_urls
            - version
            - webpage_url
        - add popularity
        - add open_access
        - rename order_type to best_access_right
        - rename language_availability to language
        - rename name to title
        - cast:
            .withColumn("publication_date", col("publication_date").cast("date"))
            .withColumn("last_update", col("last_update").cast("date"))
            .withColumn("synchronized_at", col("synchronized_at").cast("date"))
            .withColumn("updated_at", col("updated_at").cast("date"))
        - apply current transformations if needed.
    """
