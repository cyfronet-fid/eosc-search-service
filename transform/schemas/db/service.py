"""Service expected db schema"""

from datetime import datetime
from typing import List, Union

from pydantic import AnyHttpUrl, BaseModel, EmailStr

from schemas.common.public_contact import PublicContact
from schemas.common.url import BasicURL


class ServiceDBSchema(BaseModel):
    """
    Pydantic model representing the expected db schema for a service.

    Attributes:
        abbreviation (str):
            The abbreviation of the service.
        access_modes (List[str]):
            A list of access modes available for the service.
        access_policies_url (AnyHttpUrl):
            The URL for the access policies.
        access_types (List[str]):
            A list of access types available for the service.
        activate_message (str):
            The message shown when the service is activated.
        catalogues (List[str]):
            A list of catalogues associated with the service.
        categories (List[str]):
            A list of categories applicable to the service.
        certifications (List[str]):
            # TODO Add description
        changelog (List[str]):
            # TODO Add description
        dedicated_for (List[str]):
            A list of dedicated purposes for the service.
        description (str):
            A detailed description of the service.
        eosc_if (List[str]):
            # TODO Add description
        funding_bodies (List[str]):
            A list of bodies funding the service.
        funding_programs (List[str]):
            A list of funding programs supporting the service.
        guidelines (List[str]):
            A list of guidelines available for this service.
        geographical_availabilities (List[str]):
            A list of geographical locations where the service is available.
        grant_project_names (List[str]):
            A list of grant project names associated with the service.
        helpdesk_email (EmailStr):
            The email address for the helpdesk.
        helpdesk_url (AnyHttpUrl):
            The URL for the helpdesk.
        horizontal (bool):
            Indicates whether the service is horizontal.
        id (int):
            Unique identifier for the service.
        language (List[str]):
            A list of languages in which the service is available.
        last_update (datetime):
            The date when the service was last updated (ISO 8601 format).
        life_cycle_status (str):
            The life cycle status of the service.
        maintenance_url (AnyHttpUrl):
            The URL for maintenance information.
        manual_url (AnyHttpUrl):
            The URL for the service manual.
        multimedia_urls (Union[List[BasicURL], List[str]]):
            A list of multimedia URLs related to the service.
        offers_count (int):
            The count of offers available for the service.
        open_access (bool):
            Indicates whether the service is open access.
        open_source_technologies (List[str]):
            A list of open source technologies used by the service.
        best_access_right (str):
            The best access type for accessing the service.
        order_url (AnyHttpUrl):
            The URL for ordering the service.
        payment_model_url (AnyHttpUrl):
            The URL for the payment model.
        phase (str):
            The phase of the service.
        pid (str):
            Persistent identifier for the service.
        platforms (List[str]):
            A list of platforms where the service is available.
        popularity (int):
            Popularity score of the service.
        pricing_url (AnyHttpUrl):
            The URL for pricing information.
        privacy_policy_url (AnyHttpUrl):
            The URL for the privacy policy.
        providers (List[str]):
            A list of providers associated with the service.
        public_contacts (List[PublicContact]):
            A list of public contacts for the service.
        publication_date (datetime):
            The date when the service was published (ISO 8601 format).
        rating (str):
            The rating of the service.
        related_platforms (List[str]):
            A list of related platforms for the service.
        resource_geographic_locations (List[str]):
            A list of geographic locations of the resources.
        resource_organisation (str):
            The organisation responsible for the service.
        restrictions (str):
            Any restrictions associated with the service.
        scientific_domains (List[str]):
            A list of scientific domains associated with the service.
        security_contact_email (EmailStr):
            The email address for security contact.
        service_opinion_count (int):
            The number of opinions or reviews for the service.
        sla_url (AnyHttpUrl):
            The URL for the service level agreement (SLA).
        slug (str):
            The slug of the service.
        standards (List[str]):
            A list of standards followed by the service.
        status (str):
            The status of the service.
        status_monitoring_url (AnyHttpUrl):
            The URL for status monitoring.
        synchronized_at (datetime):
            The date and time when the service was last synchronized (ISO 8601 format).
        tag_list (List[str]):
            A list of tags categorizing the service.
        tagline (str):
            A tagline for the service.
        terms_of_use_url (AnyHttpUrl):
            The URL for the terms of use.
        title (str):
            The title of the service.
        training_information_url (AnyHttpUrl):
            The URL for training information.
        trl (str):
            The Technology Readiness Level (TRL) of the service.
        type (str):
            Data type = "service".
        unified_categories (List[str]):
            A list of unified categories for the service.
        updated_at (datetime):
            The date and time when the service was last updated (ISO 8601 format).
        upstream_id (Union[int, str]):
            The upstream ID of the service, can be an integer or a string.
        usage_counts_downloads (int):
            The number of times the service has been downloaded.
        usage_counts_views (int):
            The number of times the service has been viewed.
        use_cases_urls (Union[List[BasicURL], List[str]]):
            A list of use case URLs for the service, either as a list of BasicURL objects or as a list of strings.
        version (str):
            The version of the service.
        webpage_url (AnyHttpUrl):
            The URL of the service's webpage.
    """

    abbreviation: str
    access_modes: List[str]
    access_policies_url: AnyHttpUrl
    access_types: List[str]
    activate_message: str
    catalogues: List[str]
    categories: List[str]
    certifications: List[str]
    changelog: List[str]
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
    language: List[str]
    last_update: datetime
    life_cycle_status: str
    maintenance_url: AnyHttpUrl
    manual_url: AnyHttpUrl
    multimedia_urls: Union[List[BasicURL], List[str]]
    offers_count: int
    open_access: bool
    open_source_technologies: List[str]
    best_access_right: str
    order_url: AnyHttpUrl
    payment_model_url: AnyHttpUrl
    phase: str
    pid: str
    platforms: List[str]
    popularity: int
    pricing_url: AnyHttpUrl
    privacy_policy_url: AnyHttpUrl
    providers: List[str]
    public_contacts: List[PublicContact]
    publication_date: datetime
    rating: str
    related_platforms: List[str]
    resource_geographic_locations: List[str]
    resource_organisation: str
    restrictions: str
    scientific_domains: List[str]
    security_contact_email: EmailStr
    service_opinion_count: int
    sla_url: AnyHttpUrl
    slug: str
    standards: List[str]
    status: str
    status_monitoring_url: AnyHttpUrl
    synchronized_at: datetime
    tag_list: List[str]
    tagline: str
    terms_of_use_url: AnyHttpUrl
    title: str
    training_information_url: AnyHttpUrl
    trl: str
    type: str
    unified_categories: List[str]
    updated_at: datetime
    upstream_id: Union[int, str]
    usage_counts_downloads: int
    usage_counts_views: int
    use_cases_urls: Union[List[BasicURL], List[str]]
    version: str
    webpage_url: AnyHttpUrl

    """
    Transformations necessary to convert ServiceInputSchema to ServiceDBSchema
        - add type = "service"
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
    """
