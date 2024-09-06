"""Organisation expected search engine schema"""

from typing import List

from pydantic import AnyHttpUrl, BaseModel


class OrganisationSESchema(BaseModel):
    """
    Pydantic model representing the expected search engine schema for an organisation after transformations.

    Attributes:
        abbreviation (str):
            The abbreviation of the organisation. Used in resource view.
        country (List[str]):
            A list of countries associated with the organisation. Used in tags and filters.
        id (str):
            Unique identifier for the organisation.
        title (str):
            The title of the organisation. Used in searching.
        pids (str):
            Persistent identifiers for the organisation. Not used yet.
        related_dataset_ids (List[str]):
            # TODO think about moving it only to db
            A list of related dataset IDs.
        related_other_ids (List[str]):
            # TODO think about moving it only to db
            A list of related other research products IDs.
        related_publication_ids (List[str]):
            # TODO think about moving it only to db
            A list of related publication IDs.
        related_project_ids (List[str]):
            # TODO think about moving it only to db
            A list of related project IDs.
        related_software_ids (List[str]):
            # TODO think about moving it only to db
            A list of related software IDs.
        type (str):
            Data type = "organisation". Used in tabs and resource view.
        url (AnyHttpUrl):
            The URL of the organisation. Used in resource view.
    """

    abbreviation: str
    country: List[str]
    id: str
    title: str
    pids: str
    related_dataset_ids: List[str]
    related_other_ids: List[str]
    related_publication_ids: List[str]
    related_project_ids: List[str]
    related_software_ids: List[str]
    type: str
    url: AnyHttpUrl

    """
    Transformations necessary to convert OrganisationInputSchema to OrganisationDBSchema
        - add type = "organisation"
        - rename:
            "legalname": "title",
            "legalshortname": "abbreviation",
            "websiteurl": "url",
        - delete:
            - alternative_names
        - apply current transformations.
    """
