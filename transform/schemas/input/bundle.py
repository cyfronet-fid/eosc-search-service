"""Bundle expected input schema"""

from datetime import datetime
from typing import List

from pydantic import AnyHttpUrl, BaseModel, EmailStr


class BundleInputSchema(BaseModel):
    """
    Pydantic model representing the expected input schema for a bundle data type.

    Attributes:
        bundle_goals (List[str]):
            A list of goals associated with the bundle.
        catalogues (List[str]):
            A list of catalogues associated with the bundle.
        capabilities_of_goals (List[str]):
            A list of capabilities related to the bundle goals.
        contact_email (EmailStr):
            Contact email for the bundle.
        description (str):
            A detailed description of the bundle.
        eosc_if (List[str]):
            TODO: Add description.
        helpdesk_url (AnyHttpUrl):
            URL to the helpdesk for the bundle.
        id (int):
            Unique identifier for the bundle.
        iid (int):
            TODO: Add description.
        main_offer_id (int):
            Identifier for the main offer associated with the bundle.
        name (str):
            Name of the bundle.
        offer_ids (List[int]):
            A list of offer identifiers associated with the bundle.
        providers (List[str]):
            A list of providers associated with the bundle.
        publication_date (datetime):
            The date when the bundle was published (ISO 8601 format).
        related_training (bool):
            Indicator of whether there is a training associated with the bundle.
        research_steps (List[str]):
            A list of research steps (unified_categories) associated with the bundle.
        resource_organisation (str):
            The organisation responsible for the bundle.
        scientific_domains (List[str]):
            A list of scientific domains that the bundle pertains to.
        service_id (int):
            Identifier for the service associated with the bundle.
        tag_list (List[str]):
            A list of tags categorizing the bundle.
        target_users (List[str]):
            A list of target users for whom the bundle is intended.
        updated_at (datetime):
            The date when the bundle was last updated (ISO 8601 format).
        usage_counts_downloads (int):
            The number of times the bundle has been downloaded.
        usage_counts_views (int):
            The number of times the bundle has been viewed.
    """

    bundle_goals: List[str]
    catalogues: List[str]
    capabilities_of_goals: List[str]
    contact_email: EmailStr
    description: str
    eosc_if: List[str]
    helpdesk_url: AnyHttpUrl
    id: int
    iid: int
    main_offer_id: int
    name: str
    offer_ids: List[int]
    providers: List[str]
    publication_date: datetime
    related_training: bool
    research_steps: List[str]
    resource_organisation: str
    scientific_domains: List[str]
    service_id: int
    tag_list: List[str]
    target_users: List[str]
    updated_at: datetime
    usage_counts_downloads: int
    usage_counts_views: int
