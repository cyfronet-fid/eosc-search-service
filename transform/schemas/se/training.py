"""Training expected search engine schema"""

from datetime import date
from typing import List

from pydantic import BaseModel


class TrainingSESchema(BaseModel):
    """
    Pydantic model representing the expected search engine schema for training after transformations.

    Attributes:
        author_names (List[str]):
            A list of author names associated with the training. Used in tags
        author_names_tg (List[str]):
            The same data as 'author_names' but in solr text general type. Used in searching.
        best_access_right (str):
            The best access right for the training. Used in filters
        catalogue (str):
            # TODO move only to catalogues
            The catalogue associated with the training.
        catalogues (List[str]):
            # TODO is it used?
            A list of catalogues associated with the training.
        content_type (List[str]):
            A list of content types for the training. Used in tags.
        description (str):
            A detailed description of the training. Used in searching.
        duration (int):
            The duration of the training. Used in filters.
        id (str):
            Unique identifier for the training.
        keywords (List[str]):
            A list of keywords associated with the training. Used in tags.
        keywords_tg (List[str]):
            The same data as 'keywords' but in solr text general type. Used in searching.
        language (List[str]):
            A list of languages in which the training is available. Used in filters.
        level_of_expertise (str):
            The level of expertise required for the training. Used in filters.
        license (str):
            The license under which the training is provided. Used in filters and resource view.
        open_access (bool):
            # TODO is it used?
            Indicates whether the training is open access.
        providers (List[str]):
            # TODO is it used?
            A list of providers associated with the training.
        publication_date (date):
            The date when the training was published. Used in sorting.
        qualification (List[str]):
            # TODO add description. Used in filters.
        related_services (List[str]):
            # TODO is it used? Consider moving to db.
            A list of related services associated with the training.
        resource_organisation (str):
            The organisation responsible for the training. Used in filters.
        resource_type (List[str]):
            A list of resource types associated with the training. Used in filters.
        scientific_domains (List[List[str]]):
            A list of scientific domains associated with the training. Used in filters and tags.
        target_group (List[str]):
            A list of target groups for whom the training is intended. Used in filters.
        title (str):
            The title of the training. Used in searching.
        type (str):
            Data type = "training". Used in routing and resource view.
        unified_categories (List[str]):
            A list of unified categories for the training. Used in filters.
        url (List[str]):
            A list of URLs related to the training. Used in resource view.
    """

    author_names: List[str]
    author_names_tg: List[str]
    best_access_right: str
    catalogue: str  # TODO delete
    catalogues: List[str]
    content_type: List[str]
    description: str
    duration: int
    id: str
    keywords: List[str]
    keywords_tg: List[str]
    language: List[str]
    level_of_expertise: str
    license: str
    open_access: bool
    providers: List[str]
    publication_date: date
    qualification: List[str]
    related_services: List[str]
    resource_organisation: str
    resource_type: List[str]
    scientific_domains: List[List[str]]
    target_group: List[str]
    title: str
    type: str
    unified_categories: List[str]
    url: List[str]

    """
    Transformations necessary to convert TrainingInputSchema to TrainingSESchema
        - add type = "training"
        - add open_access
        - add unified categories
        - delete: 
            - alternative_ids
            - eosc_provider
            - geographical_availabilities
            - learning_outcomes
            - url_type
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
