"""Data source expected input schema"""

from datetime import datetime
from typing import List, Union

from pydantic import AnyHttpUrl, BaseModel, EmailStr

from schemas.common.public_contact import PublicContact
from schemas.common.url import BasicURL


class PersistentIdentitySystem(BaseModel):
    """
    Model representing a persistent identity system.

    Attributes:
        entity_type (str):
            The type of the entity.
        entity_type_schemes (List[str]):
            The schemes associated with the entity type.
    """

    entity_type: str
    entity_type_schemes: List[str]


class DataSourceInputSchema(BaseModel):
    """
    Pydantic model representing the expected input schema for a data source.

    Attributes:
        abbreviation (str):
            The abbreviation of the data source.
        access_modes (List[str]):
            A list of access modes available for the data source.
        access_types (List[str]):
            A list of access types available for the data source.
        catalogues (List[str]):
            A list of catalogues associated with the data source.
        categories (List[str]):
            A list of categories applicable to the data source.
        certifications (List[str]):
            TODO: Add description.
        changelog (List[str]):
            TODO: Add description.
        datasource_classification (str):
            The classification of the data source.
        dedicated_for (List[str]):
            A list of dedicated purposes for the data source.
        description (str):
            A detailed description of the data source.
        eosc_if (List[str]):
            TODO: Add description.
        funding_bodies (List[str]):
            A list of bodies funding the data source.
        funding_programs (List[str]):
            A list of funding programs supporting the data source.
        guidelines (List[str]):
            A list of guidelines available for this data source.
        geographical_availabilities (List[str]):
            A list of geographical locations where the data source is available.
        grant_project_names (List[str]):
            A list of grant project names associated with the data source.
        helpdesk_email (EmailStr):
            The email address for the helpdesk.
        helpdesk_url (AnyHttpUrl):
            The URL for the helpdesk.
        horizontal (bool):
            Indicates whether the data source is horizontal.
        id (int):
            Unique identifier for the data source.
        jurisdiction (str):
            The jurisdiction under which the data source operates.
        language_availability (List[str]):
            A list of languages in which the data source is available.
        last_update (datetime):
            The date when the data source was last updated (ISO 8601 format).
        life_cycle_status (str):
            The life cycle status of the data source.
        maintenance_url (AnyHttpUrl):
            The URL for maintenance information.
        manual_url (AnyHttpUrl):
            The URL for the data source manual.
        multimedia_urls (Union[List[BasicURL], List[str]]):
            A list of multimedia URLs related to the data source.
        name (str):
            The name of the data source.
        open_source_technologies (List[str]):
           # TODO Add description.
        order_type (str):
            The order type for accessing the data source.
        order_url (AnyHttpUrl):
            The URL for ordering the data source.
        payment_model_url (AnyHttpUrl):
            The URL for the payment model.
        persistent_identity_systems (List[PersistentIdentitySystem]):
            A list of persistent identity systems used by the data source.
        pid (str):
            Persistent identifier for the data source.
        platforms (List[str]):
            A list of platforms where the data source is available.
        preservation_policy_url (AnyHttpUrl):
            The URL for the preservation policy.
        pricing_url (AnyHttpUrl):
            The URL for pricing information.
        privacy_policy_url (AnyHttpUrl):
            The URL for the privacy policy.
        providers (List[str]):
            A list of providers associated with the bundle.
        public_contacts (List[PublicContact]):
            A list of public contacts for the data source.
        publication_date (datetime):
            The date when the data source was published (ISO 8601 format).
        research_entity_types (List[str]):
            A list of research entity types associated with the data source.
        research_product_access_policies (List[str]):
            A list of access policies for research products.
        research_product_licensing_urls (List[BasicURL]):
            A list of licensing URLs for research products.
        research_product_metadata_access_policies (List[str]):
            A list of metadata access policies for research products.
        research_product_metadata_license_urls (List[BasicURL]):
            A list of metadata license URLs for research products.
        resource_geographic_locations (List[str]):
            A list of geographic locations of the resources.
        resource_level_url (AnyHttpUrl):
            The URL for the resource level.
        resource_organisation (str):
            The organisation responsible for the data source.
        scientific_domains (List[str]):
            A list of scientific domains associated with the data source.
        security_contact_email (EmailStr):
            The email address for security contact.
        standards (List[str]):
            A list of standards followed by the data source.
        status (str):
            The status of the data source.
        status_monitoring_url (AnyHttpUrl):
            The URL for status monitoring.
        submission_policy_url (AnyHttpUrl):
            The URL for the submission policy.
        synchronized_at (datetime):
            The date and time when the data source was last synchronized (ISO 8601 format).
        tag_list (List[str]):
            A list of tags categorizing the data source.
        tagline (str):
            A tagline for the data source.
        terms_of_use_url (AnyHttpUrl):
            The URL for the terms of use.
        thematic (bool):
            Indicates whether the data source is thematic.
        training_information_url (AnyHttpUrl):
            The URL for training information.
        trl (str):
            The Technology Readiness Level (TRL) of the data source.
        unified_categories (List[str]):
            A list of unified categories for the data source.
        updated_at (datetime):
            The date and time when the data source was last updated (ISO 8601 format).
        upstream_id (Union[int, str]):
            The upstream ID of the data source, can be an integer or a string.
        usage_counts_downloads (int):
            The number of times the data source has been downloaded.
        usage_counts_views (int):
            The number of times the data source has been viewed.
        use_cases_urls (Union[List[BasicURL], List[str]]):
            A list of use case URLs for the data source, either as a list of UseCaseURL objects or as a list of strings.
        version (str):
            The version of the data source.
        version_control (bool):
            Indicates whether the data source has version control.
        webpage_url (AnyHttpUrl):
            The URL of the data source's webpage.
    """

    abbreviation: str
    access_modes: List[str]
    access_types: List[str]
    catalogues: List[str]
    categories: List[str]
    certifications: List[str]
    changelog: List[str]
    datasource_classification: str
    dedicated_for: List[str]
    description: str
    eosc_if: List[str]
    funding_bodies: List[str]
    funding_programs: List[str]
    guidelines: List[str]
    geographical_availabilities: List[str]
    grant_project_names: List[str]
    helpdesk_email: EmailStr
    helpdesk_url: AnyHttpUrl
    horizontal: bool
    id: int
    jurisdiction: str
    language_availability: List[str]
    last_update: datetime
    life_cycle_status: str
    maintenance_url: AnyHttpUrl
    manual_url: AnyHttpUrl
    multimedia_urls: Union[List[BasicURL], List[str]]
    name: str
    open_source_technologies: List[str]
    order_type: str
    order_url: AnyHttpUrl
    payment_model_url: AnyHttpUrl
    persistent_identity_systems: List[PersistentIdentitySystem]
    pid: str
    platforms: List[str]
    preservation_policy_url: AnyHttpUrl
    pricing_url: AnyHttpUrl
    privacy_policy_url: AnyHttpUrl
    providers: List[str]
    public_contacts: List[PublicContact]
    publication_date: datetime
    research_entity_types: List[str]
    research_product_access_policies: List[str]
    research_product_licensing_urls: List[BasicURL]
    research_product_metadata_access_policies: List[str]
    research_product_metadata_license_urls: List[BasicURL]
    resource_geographic_locations: List[str]
    resource_level_url: AnyHttpUrl
    resource_organisation: str
    scientific_domains: List[str]
    security_contact_email: EmailStr
    standards: List[str]
    status: str
    status_monitoring_url: AnyHttpUrl
    submission_policy_url: AnyHttpUrl
    synchronized_at: datetime
    tag_list: List[str]
    tagline: str
    terms_of_use_url: AnyHttpUrl
    thematic: bool
    training_information_url: AnyHttpUrl
    trl: str
    unified_categories: List[str]
    updated_at: datetime
    upstream_id: Union[int, str]
    usage_counts_downloads: int
    usage_counts_views: int
    use_cases_urls: Union[List[BasicURL], List[str]]
    version: str
    version_control: bool
    webpage_url: AnyHttpUrl
