"""Organisation expected input schema"""

from typing import List

from pydantic import AnyHttpUrl, BaseModel

from schemas.common.oag.country import Country
from schemas.common.oag.pid import PID


class OrganisationInputSchema(BaseModel):
    """
    Pydantic model representing the expected input schema for an organisation.

    Attributes:
        alternativenames (List[str]):
            A list of alternative names for the organisation.
        country (Country):
            The country details of the organisation.
        id (str):
            The unique identifier of the organisation.
        legalname (str):
            The legal name of the organisation.
        legalshortname (str):
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
        websiteurl (AnyHttpUrl):
            The website URL of the organisation.
    """

    alternativenames: List[str]
    country: Country
    id: str
    legalname: str
    legalshortname: str
    pid: List[PID]
    related_dataset_ids: List[str]
    related_organisation_titles: List[str]
    related_other_ids: List[str]
    related_publication_ids: List[str]
    related_software_ids: List[str]
    websiteurl: AnyHttpUrl
