"""Publication expected input schema"""

from typing import List, Optional, Union

from pydantic import BaseModel

from schemas.common.oag.affiliation import Affiliation
from schemas.common.oag.author import Author
from schemas.common.oag.best_access_right import BestAccessRight
from schemas.common.oag.container import Container
from schemas.common.oag.context import Context
from schemas.common.oag.country import Country
from schemas.common.oag.indicator import Indicator
from schemas.common.oag.instance import Instance
from schemas.common.oag.key_value_model import KeyValueModel
from schemas.common.oag.language import Language
from schemas.common.oag.pid import PID
from schemas.common.oag.project import Project
from schemas.common.oag.relation import Relation
from schemas.common.oag.subject import Subject


class PublicationInputSchema(BaseModel):
    """
    Pydantic model representing the expected input schema for a publication.

    Attributes:
        affiliation (Optional[List[Affiliation]]):
            A list of affiliation details for the publication.
        author (Optional[List[Author]]):
            A list of author details for the publication.
        best_access_right (Optional[BestAccessRight]):
            The best access right for the publication.
        collected_from (Optional[KeyValueModel]):
            The source of the publication.
        container (Optional[Container]):
            The container details of the publication.
        context (Optional[Context]):
            The context details of the publication.
        contributor (Optional[List[str]]):
            A list of contributors for the publication.
        country (Optional[Country]):
            The country details of the publication.
        coverage (Optional[List[str]]):
            A list of coverage details for the publication.
        date_of_collection (Optional[str]):
            The date of collection for the publication.
        description (Optional[List[str]]):
            A list of descriptions for the publication.
        embargo_end_date (Optional[str]):
            The end date of the embargo for the publication.
        eosc_if (Optional[List[str]]):
            The EOSC IF details for the publication.
        format (Optional[List[str]]):
            A list of formats for the publication.
        fulltext (Optional[List[str]]):
            A list of fulltext details for the publication.
        id (str):
            The unique identifier of the publication.
        indicator (Optional[Indicator]):
            The indicator details for the publication.
        instance (Optional[Instance]):
            The instance details for the publication.
        keywords (Optional[List[str]]):
            A list of keywords for the publication.
        language (Optional[Language]):
            The language details for the publication.
        last_update_timestamp (Optional[int]):
            The last update timestamp for the publication.
        main_title (Optional[str]):
            The main title of the publication.
        original_id (Optional[List[str]]):
            A list of original identifiers for the publication.
        pid (Optional[List[PID]]):
            A list of persistent identifiers for the publication.
        projects (Optional[List[Project]]):
            A list of project details for the publication.
        publication_date (Optional[str]):
            The publication date for the publication.
        publisher (Optional[str]):
            The publisher of the publication.
        relations (Optional[List[Relation]]):
            A list of relation details for the publication.
        source (Optional[List[Union[str, None]]]):
            A list of source details for the publication.
        subject (Optional[Subject]):
            The subject details for the publication.
        subtitle (Optional[str]):
            The subtitle of the publication.
        type (Optional[str]):
            The type of the publication.
    """

    affiliation: Optional[List[Affiliation]]
    author: Optional[List[Author]]
    best_access_right: Optional[BestAccessRight]
    collected_from: Optional[KeyValueModel]
    container: Optional[Container]
    context: Optional[Context]
    contributor: Optional[List[str]]
    country: Optional[Country]
    coverage: Optional[List[str]]
    date_of_collection: Optional[str]
    description: Optional[List[str]]
    embargo_end_date: Optional[str]
    eosc_if: Optional[List[str]]
    format: Optional[List[str]]
    fulltext: Optional[List[str]]
    id: str
    indicator: Optional[Indicator]
    instance: Optional[Instance]
    keywords: Optional[List[str]]
    language: Optional[Language]
    last_update_timestamp: Optional[int]
    main_title: Optional[str]
    original_id: Optional[List[str]]
    pid: Optional[List[PID]]
    projects: Optional[List[Project]]
    publication_date: Optional[str]
    publisher: Optional[str]
    relations: Optional[List[Relation]]
    source: Optional[List[Union[str, None]]]
    subject: Optional[Subject]
    subtitle: Optional[str]
    type: Optional[str]
