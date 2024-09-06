"""Expected db training schema"""

from datetime import datetime
from typing import List, Union

from pydantic import AnyHttpUrl, BaseModel, EmailStr

from schemas.input.training import (
    AlternativeIdentifier,
    ScientificDomain,
    TrainingContact,
)


class TrainingDBSchema(BaseModel):
    """
    Pydantic model representing the expected db schema for training.

    Attributes:
        best_access_right (str):
            The access rights of the training.
        alternative_ids (List[AlternativeIdentifier]):
            A list of alternative identifiers for the training.
        author_names (List[str]):
            A list of authors of the training.
        catalogues (str):
            The catalogue identifier for the training.
        contact (Union[TrainingContact, str]):
            The contact information for the training, either as a Contact object or a string.
        content_type (List[str]):
            A list of content resource types for the training.
        description (str):
            A detailed description of the training.
        duration (int):
            The duration of the training.
        related_services (List[str]):
            A list of EOSC related services for the training.
        level_of_expertise (str):
            The expertise level required for the training.
        geographical_availabilities (List[str]):
            A list of geographical locations where the training is available.
        id (str):
            The unique identifier of the training.
        keywords (List[str]):
            A list of keywords associated with the training.
        language (List[str]):
            A list of languages in which the training is available.
        learning_outcomes (List[str]):
            A list of learning outcomes for the training.
        resource_type (List[str]):
            A list of learning resource types for the training.
        license (str):
            The license under which the training is provided.
        open_access (bool):
            Indicates whether the training is open access.
        qualification (List[str]):
            A list of qualifications associated with the training.
        resource_organisation (str):
            The organisation responsible for the training.
        providers (List[str]):
            A list of resource providers for the training.
        scientific_domains (List[ScientificDomain]):
            A list of scientific domains and subdomains associated with the training.
        target_group (List[str]):
            A list of target groups for the training.
        title (str):
            The title of the training.
        type (str):
            Data type = "training".
        unified_categories (List[str]):
            A list of unified categories for the training.
        url (AnyHttpUrl):
            The URL of the training.
        url_type (str):
            The type of the URL.
        publication_date (datetime):
            The version date of the training (ISO 8601 format).
    """

    best_access_right: str
    alternative_ids: List[AlternativeIdentifier]
    author_names: List[str]
    catalogues: str
    contact: Union[TrainingContact, str]
    content_type: List[str]
    description: str
    duration: int
    related_services: List[str]
    level_of_expertise: str
    geographical_availabilities: List[str]
    id: str
    keywords: List[str]
    language: List[str]
    learning_outcomes: List[str]
    resource_type: List[str]
    license: str
    open_access: bool
    qualification: List[str]
    resource_organisation: str
    providers: List[str]
    scientific_domains: List[ScientificDomain]
    target_group: List[str]
    title: str
    type: str
    unified_categories: List[str]
    url: List[AnyHttpUrl]
    url_type: str
    publication_date: datetime

    """
    Transformations necessary to convert TrainingInputSchema to TrainingDBSchema
        - add type = "training"
        - add open_access
        - add unified categories
        - do mappings:
            - map_arr_that_ends_with
            - map_lvl_of_expertise
            - map_geo_av
            - map_lang
            - map_resource_type
            - map_sci_domains
            - ts_to_iso
            - serialize_alternative_ids
            - map_providers_and_orgs
        - rename:
            "accessRights": "best_access_right",
            "alternativeIdentifiers": "alternative_ids",
            "authors": "author_names",
            "catalogueId": "catalogues",
            "contentResourceTypes": "content_type",
            "eoscRelatedServices": "related_services",
            "expertiseLevel": "level_of_expertise",
            "geographicalAvailabilities": "geographical_availabilities",
            "languages": "language",
            "learningOutcomes": "learning_outcomes",
            "learningResourceTypes": "resource_type",
            "qualifications": "qualification",
            "resourceOrganisation": "resource_organisation",
            "resourceProviders": "providers",
            "scientificDomains": "scientific_domains",
            "targetGroups": "target_group",
            "urlType": "url_type",
            "versionDate": "publication_date",
        - cast:
            df.withColumn("url", split(col("url"), ","))
            df.withColumn("duration", col("duration").cast("bigint"))
            transform_date(df, "publication_date", "yyyy-MM-dd")
    """
