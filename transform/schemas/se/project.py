"""Project expected search engine schema"""

from datetime import date
from typing import List

from pydantic import BaseModel


class ProjectSESchema(BaseModel):
    """
    Pydantic model representing the expected search engine schema for a project after transformations.

    Attributes:
        abbreviation (str):
            The abbreviation of the project. Used in resource view.
        code (str):
            The code of the project. Used in resource view.
        currency (str):
            The currency used in the project funding. Used in resource view.
        date_range (str):
            The date range of the project. Used in resource view.
        description (str):
            A detailed description of the project. Used in searching.
        end_date (date):
            The end date of the project. Used in resource view.
        eosc_score (int):
            The EOSC score of the project. Can be used in sorting in the future.
        funding_stream_title (List[str]):
            A list of titles of the funding streams. Used in filters, tags and resource view.
        funding_title (List[str]):
            A list of funding titles. Used in filters and tags.
        id (str):
            Unique identifier for the project.
        keywords (List[str]):
            A list of keywords associated with the project. Used in secondary tags.
        keywords_tg (List[str]):
            The same data as 'keywords' but in solr text general type. Used in searching.
        open_access_mandate_for_dataset (bool):
            Indicates whether there is an open access mandate for datasets. Used in filters.
        open_access_mandate_for_publications (bool):
            Indicates whether there is an open access mandate for publications. Used in filers.
        related_dataset_ids (List[str]):
            # TODO consider moving to db
            A list of related dataset IDs.
        related_organisation_titles (List[str]):
            # TODO consider moving to db
            A list of titles of related organisations.
        related_other_ids (List[str]):
            # TODO consider moving to db
            A list of related other research products IDs.
        related_publication_ids (List[str]):
            # TODO consider moving to db
            A list of related publication IDs.
        related_software_ids (List[str]):
            # TODO consider moving to db
            A list of related software IDs.
        start_date (date):
            The start date of the project. Used in resource view.
        title (str):
            The title of the project. Used in searching.
        total_cost (float):
            The total cost of the project. Used in resource view.
        type (str):
            Data type = "project". Used in routing and resource view.
    """

    abbreviation: str
    code: str
    currency: str
    date_range: str
    description: str
    end_date: date
    eosc_score: int
    funding_stream_title: List[str]
    funding_title: List[str]
    id: str
    keywords: List[str]
    keywords_tg: List[str]
    open_access_mandate_for_dataset: bool
    open_access_mandate_for_publications: bool
    related_dataset_ids: List[str]
    related_organisation_titles: List[str]
    related_other_ids: List[str]
    related_publication_ids: List[str]
    related_software_ids: List[str]
    start_date: date
    title: str
    total_cost: float
    type: str

    """
    Transformations necessary to convert ProjectInputSchema to ProjectSESchema
        - add type = "project"
        - delete
            - subject
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
        - apply current transformations if needed
    """
