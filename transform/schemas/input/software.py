"""Software expected input schema"""

from typing import List, Optional, Union

from pydantic import AnyHttpUrl, BaseModel

from schemas.common.oag.affiliation import Affiliation
from schemas.common.oag.author import Author
from schemas.common.oag.best_access_right import BestAccessRight
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


class SoftwareInputSchema(BaseModel):
    """
    Model representing the expected input schema for software.

    Attributes:
        affiliation (Optional[List[Affiliation]]):
            A list of affiliation details.
        author (Optional[List[Author]]):
            A list of author details.
        best_access_right (Optional[BestAccessRight]):
            The best access right details.
        collected_from (Optional[KeyValueModel]):
            The source of the data collection.
        context (Optional[Context]):
            The context details.
        contributor (Optional[List[str]]):
            A list of contributors.
        country (Optional[Country]):
            The country details.
        coverage (Optional[List[str]]):
            A list of coverage details.
        date_of_collection (Optional[str]):
            The date of data collection.
        description (Optional[List[str]]):
            A list of descriptions.
        documentation_url (Optional[List[AnyHttpUrl]]):
            A list of documentation URLs.
        embargo_end_date (Optional[str]):
            The end date of the embargo.
        eosc_if (Optional[List[str]]):
            The EOSC IF details for the software.
        format (Optional[List[str]]):
            A list of formats.
        id (str):
            The unique identifier.
        indicator (Optional[Indicator]):
            The indicator details.
        instance (Optional[Instance]):
            The instance details.
        keywords (Optional[List[str]]):
            A list of keywords.
        language (Optional[Language]):
            The language details.
        last_update_timestamp (Optional[int]):
            The timestamp of the last update.
        main_title (Optional[str]):
            The main title.
        original_id (Optional[List[str]]):
            A list of original identifiers.
        pid (Optional[List[PID]]):
            A list of persistent identifiers.
        programming_language (Optional[List[str]]):
            A list of programming languages.
        projects (Optional[List[Project]]):
            A list of project details.
        publication_date (Optional[str]):
            The publication date.
        publisher (Optional[str]):
            The publisher.
        relations (Optional[List[Relation]]):
            A list of relation details.
        source (Optional[List[Union[str, None]]]):
            A list of source details.
        subject (Optional[Subject]):
            The subject details.
        subtitle (Optional[str]):
            The subtitle.
        type (Optional[str]):
            The type of the software.
    """

    affiliation: Optional[List[Affiliation]]
    author: Optional[List[Author]]
    best_access_right: Optional[BestAccessRight]
    collected_from: Optional[KeyValueModel]
    context: Optional[Context]
    contributor: Optional[List[str]]
    country: Optional[Country]
    coverage: Optional[List[str]]
    date_of_collection: Optional[str]
    description: Optional[List[str]]
    documentation_url: Optional[List[AnyHttpUrl]]
    embargo_end_date: Optional[str]
    eosc_if: Optional[List[str]]
    format: Optional[List[str]]
    id: str
    indicator: Optional[Indicator]
    instance: Optional[Instance]
    keywords: Optional[List[str]]
    language: Optional[Language]
    last_update_timestamp: Optional[int]
    main_title: Optional[str]
    original_id: Optional[List[str]]
    pid: Optional[List[PID]]
    programming_language: Optional[List[str]]
    projects: Optional[List[Project]]
    publication_date: Optional[str]
    publisher: Optional[str]
    relations: Optional[List[Relation]]
    source: Optional[List[Union[str, None]]]
    subject: Optional[Subject]
    subtitle: Optional[str]
    type: Optional[str]
