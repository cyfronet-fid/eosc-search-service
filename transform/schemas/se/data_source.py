"""Data source expected search engine schema"""

from datetime import date
from typing import List

from pydantic import AnyHttpUrl, BaseModel, EmailStr


class DataSourceSESchema(BaseModel):
    """
    Pydantic model representing the expected search engine schema for a data source after transformations.

    Attributes:
        best_access_right (str):
            The best access right for the data source. Used in filters.
        catalogue (str):
            TODO replace with catalogues. Make sure that backend/frontend are not using it.
            The catalogue associated with the data source.
        catalogues (List[str]):
            TODO is it used anywhere for data sources?
            A list of catalogues associated with the data source.
        categories (List[str]):
            A list of categories applicable to the data source. Used in filters.
        dedicated_for (List[str]):
            A list of dedicated purposes for the data source. Used in filters.
        description (str):
            A detailed description of the data source. Used in searching.
        eosc_if (List[str]):
            TODO add description. Used in filters and secondary tags
        eosc_if_tg (List[str]):
            The same data as 'eosc_if' but in solr text general type. Used in searching.
        guidelines (List[str]):
            A list of guidelines available for this data source. Used in tags
        geographical_availabilities (List[str]):
            A list of geographical locations where the data source is available. Used in filters.
        horizontal (bool):
            Indicates whether the data source is horizontal. Used in resource view and filters.
        id (str):
            Unique identifier for the data source.
        language (List[str]):
            A list of languages in which the data source is available. Used in resource view and filters.
        open_access (bool):
            TODO Saw no usage in the code. Dive deeper.
            Indicates whether the data source is open access.
        pid (str):
            Persistent identifier for the data source. Used in resource view.
        platforms (List[str]):
            A list of platforms where the data source is available. Used in filters
        popularity (int):
            Popularity score of the data source. Used in sorting.
        providers (List[str]):
            A list of providers associated with the data source. In filters.
        publication_date (date):
            The date when the data source was published. Used in sorting
        resource_organisation (str):
            The organisation responsible for the data source. Used in tags and filters.
        scientific_domains (List[str]):
            A list of scientific domains associated with the data source. Used in tags and filters
        tag_list (List[str]):
            TODO rename it to keywords
            A list of tags categorizing the data source. Used in tags and filters
        tag_list_tg (List[str]):
            # TODO rename it to keywords_tg
            A list of target group tags categorizing the data source, the same data as 'tag_list' but in text general type. Used in searching.
        title (str):
            The title of the data source. Used in searching.
        type (str):
            Data type = "data source". Used in tabs and resource view.
        unified_categories (List[str]):
            A list of unified categories for the data source. Used in filters.
        usage_counts_downloads (int):
            The number of times the data source has been downloaded. Part of popularity.
        usage_counts_views (int):
            The number of times the data source has been viewed. Part of popularity.
    """

    best_access_right: str
    catalogue: str  # TODO replace with catalogues. Make sure that backend/frontend are not using it.
    catalogues: List[str]  # TODO is it used anywhere for data sources?
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
    resource_organisation: str
    scientific_domains: List[str]
    tag_list: List[str]
    tag_list_tg: List[str]
    title: str
    type: str
    unified_categories: List[str]
    usage_counts_downloads: int
    usage_counts_views: int
    webpage_url: AnyHttpUrl

    """
    Transformations necessary to convert DataSourceInputSchema to DataSourceSESchema
        - add type = "data source"
        - add popularity
        - add open_access
        - rename order_type to best_access_right
        - rename language_availability to language
        - rename name to title
        - cast:
            .withColumn("publication_date", col("publication_date").cast("date"))
        - convert IDs
            .withColumn(ID, (col(ID) + self.id_increment))
        - delete:
            - abbreviation
            - access_modes
            - access_types
            - certifications
            - changelog
            - datasource_classification
            - funding_bodies
            - funding_programs
            - grant_project_names
            - helpdesk_email
            - helpdesk_url
            - jurisdiction
            - last_update
            - life_cycle_status
            - maintenance_url
            - manual_url
            - multimedia_urls
            - open_source_technologies
            - order_url
            - payment_model_url
            - persistent_identity_systems_entity_type
            - persistent_identity_systems_entity_type_schemes
            - preservation_policy_url
            - pricing_url
            - privacy_policy_url
            - research_entity_types
            - research_product_access_policies
            - research_product_licensing_urls
            - research_product_metadata_access_policies
            - research_product_metadata_license_urls
            - resource_geographic_locations
            - resource_level_url
            - security_contact_email
            - standards
            - status
            - status_monitoring_url
            - submission_policy_url
            - synchronized_at
            - tagline
            - terms_of_use_url
            - thematic
            - training_information_url
            - trl
            - updated_at
            - upstream_id
            - use_cases_urls
            - version
            - version_control
            - webpage_url
    """
