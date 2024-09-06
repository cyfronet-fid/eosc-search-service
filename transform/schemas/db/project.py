"""Project expected db schema"""

from datetime import datetime
from typing import List

from pydantic import AnyHttpUrl, BaseModel

from schemas.input.project import Funding, Granted, H2020Programme


class ProjectDBSchema(BaseModel):
    """
    Pydantic model representing the expected db schema for a project.

    Attributes:
        abbreviation (str):
            The abbreviation of the project.
        callidentifier (str):
            The call identifier of the project.
        code (str):
            The code of the project.
        date_range (str):
            The date range of the project.
        end_date (datetime):
            The end date of the project (ISO 8601 format).
        eosc_score (int):
            The EOSC score of the project.
        funding (List[Funding]):
            A list of funding details for the project.
        granted (Granted):
            The granted funding details for the project.
        h2020programme (List[H2020Programme]):
            A list of H2020 programme details.
        id (str):
            The unique identifier of the project.
        keywords (str):
            Keywords associated with the project.
        open_access_mandate_for_dataset (bool):
            Indicates whether there is an open access mandate for datasets.
        open_access_mandate_for_publications (bool):
            Indicates whether there is an open access mandate for publications.
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
        startdate (datetime):
            The start date of the project (ISO 8601 format).
        subject (List[str]):
            A list of subjects associated with the project.
        description (str):
            A description of the project.
        title (str):
            The title of the project.
        type (str):
            Data type = "project".
        url (AnyHttpUrl):
            The website URL of the project.
    """

    abbreviation: str
    callidentifier: str
    code: str
    date_range: str
    end_date: datetime
    eosc_score: int
    funding: List[Funding]
    granted: Granted
    h2020programme: List[H2020Programme]
    id: str
    keywords: List[str]
    open_access_mandate_for_dataset: bool
    open_access_mandate_for_publications: bool
    related_dataset_ids: List[str]
    related_organisation_titles: List[str]
    related_other_ids: List[str]
    related_publication_ids: List[str]
    related_software_ids: List[str]
    start_date: datetime
    subject: List[str]
    description: str
    title: str
    type: str
    url: AnyHttpUrl

    """
    Transformations necessary to convert ProjectInputSchema to ProjectDBSchema
        - add type = "project"
        - add eosc_score
        - add date_range
        - rename:
            "acronym": "abbreviation",
            "enddate": "end_date",
            "openaccessmandatefordataset": "open_access_mandate_for_dataset",
            "openaccessmandateforpublications": "open_access_mandate_for_publications",
            "startdate": "start_date",
            "summary": "description",
            "websiteurl": "url"
        - keywords str -> arr<str>  # TODO apparently there is bug on Openaire side and keywords are wrongly formatted, harvest_keywords may be necessary 
    """
