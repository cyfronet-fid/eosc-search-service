"""Project expected input schema"""

from datetime import datetime
from typing import List

from pydantic import AnyHttpUrl, BaseModel


class FundingStream(BaseModel):
    """
    Model representing a funding stream.

    Attributes:
        description (str):
            The description of the funding stream.
        id (str):
            The unique identifier of the funding stream.
    """

    description: str
    id: str


class Funding(BaseModel):
    """
    Model representing funding information.

    Attributes:
        funding_stream (FundingStream):
            The funding stream details.
        jurisdiction (str):
            The jurisdiction of the funding.
        name (str):
            The name of the funding.
        shortName (str):
            The short name of the funding.
    """

    funding_stream: FundingStream
    jurisdiction: str
    name: str
    shortName: str


class Granted(BaseModel):
    """
    Model representing granted funding details.

    Attributes:
        currency (str):
            The currency of the granted funding.
        fundedamount (float):
            The funded amount.
        totalcost (float):
            The total cost.
    """

    currency: str
    fundedamount: float
    totalcost: float


class H2020Programme(BaseModel):
    """
    Model representing an H2020 programme.

    Attributes:
        code (str):
            The code of the H2020 programme.
        description (str):
            The description of the H2020 programme.
    """

    code: str
    description: str


class ProjectInputSchema(BaseModel):
    """
    Pydantic model representing the expected input schema for a project.

    Attributes:
        acronym (str):
            The acronym of the project.
        callidentifier (str):
            The call identifier of the project.
        code (str):
            The code of the project.
        enddate (datetime):
            The end date of the project (ISO 8601 format).
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
        openaccessmandatefordataset (bool):
            Indicates whether there is an open access mandate for datasets.
        openaccessmandateforpublications (bool):
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
        summary (str):
            A summary of the project.
        title (str):
            The title of the project.
        websiteurl (AnyHttpUrl):
            The website URL of the project.
    """

    acronym: str
    callidentifier: str
    code: str
    enddate: datetime
    funding: List[Funding]
    granted: Granted
    h2020programme: List[H2020Programme]
    id: str
    keywords: str
    openaccessmandatefordataset: bool
    openaccessmandateforpublications: bool
    related_dataset_ids: List[str]
    related_organisation_titles: List[str]
    related_other_ids: List[str]
    related_publication_ids: List[str]
    related_software_ids: List[str]
    startdate: datetime
    subject: List[str]
    summary: str
    title: str
    websiteurl: AnyHttpUrl
