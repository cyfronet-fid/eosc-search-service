"""Organisation expected db schema"""

from typing import List

from pydantic import AnyHttpUrl, BaseModel

from schemas.input.organisation import PID, Country


class OrganisationDBSchema(BaseModel):
    """
    Pydantic model representing the expected db schema for an organisation.

    Attributes:
        alternativenames (List[str]):
            A list of alternative names for the organisation.
        country (Country):
            The country details of the organisation.
        id (str):
            The unique identifier of the organisation.
        title (str):
            The legal name of the organisation.
        abbreviation (str):
            The legal short name of the organisation.
        pid (List[PID]):
            A list of persistent identifiers associated with the organisation.
        related_dataset_ids (List[str]):
            A list of related dataset IDs.
        related_organisation_titles (List[str]):
            A list of titles of related organisations.
        related_other_ids (List[str]):
            A list of other research products related IDs.
        related_publication_ids (List[str]):
            A list of related publication IDs.
        related_software_ids (List[str]):
            A list of related software IDs.
        type (str):
            Data type = "organisation".
        url (AnyHttpUrl):
            The website URL of the organisation.
    """

    alternativenames: List[str]
    country: Country
    id: str
    title: str
    abbreviation: str
    pid: List[PID]
    related_dataset_ids: List[str]
    related_organisation_titles: List[str]
    related_other_ids: List[str]
    related_publication_ids: List[str]
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
        - #TODO alternativenames vs alternative_names - not sure if renaming is good enough. Maybe there is a need for harvest_alternative_names method
    """
