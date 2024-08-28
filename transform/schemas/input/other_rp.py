"""Other research products expected input schema"""

from typing import List, Optional, Union

from pydantic import BaseModel

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


class OtherRPInputSchema(BaseModel):
    """
    Pydantic model representing the expected input schema for other research product.

    Attributes:
        affiliation (Optional[List[Affiliation]]):
            A list of affiliation details for the other research product.
        author (Optional[List[Author]]):
            A list of author details for the other research product.
        best_access_right (Optional[BestAccessRight]):
            The best access right details for the other research product.
        collected_from (Optional[KeyValueModel]):
            The collection source details for the other research product.
        contact_group (Optional[List[str]]):
            A list of contact group details for the other research product.
        contact_person (Optional[List[str]]):
            A list of contact person details for the other research product.
        context (Optional[Context]):
            The context details for the other research product.
        contributor (Optional[List[str]]):
            A list of contributor details for the other research product.
        country (Optional[Country]):
            The country details for the other research product.
        coverage (Optional[List[str]]):
            A list of coverage details for the other research product.
        date_of_collection (Optional[str]):
            The date of collection for the other research product.
        description (Optional[List[str]]):
            A list of descriptions for the other research product.
        embargo_end_date (Optional[str]):
            The end date of the embargo for the other research product.
        eosc_if (Optional[List[str]]):
            The EOSC IF details for the other research product.
        format (Optional[List[str]]):
            A list of formats for the other research product.
        fulltext (Optional[List[str]]):
            A list of fulltext details for the other research product.
        id (str):
            The unique identifier of the other research product.
        indicator (Optional[Indicator]):
            The indicator details for the other research product.
        instance (Optional[Instance]):
            The instance details for the other research product.
        keywords (Optional[List[str]]):
            A list of keywords for the other research product.
        language (Optional[Language]):
            The language details for the other research product.
        last_update_timestamp (Optional[int]):
            The last update timestamp for the other research product.
        main_title (Optional[str]):
            The main title of the other research product.
        original_id (Optional[List[str]]):
            A list of original identifiers for the other research product.
        pid (Optional[List[PID]]):
            A list of persistent identifiers for the other research product.
        projects (Optional[List[Project]]):
            A list of project details for the other research product.
        publication_date (Optional[str]):
            The publication date for the other research product.
        publisher (Optional[str]):
            The publisher of the other research product.
        relations (Optional[List[Relation]]):
            A list of relation details for the other research product.
        source (Optional[List[Union[str, None]]]):
            A list of source details for the other research product.
        subject (Optional[Subject]):
            The subject details for the other research product.
        subtitle (Optional[str]):
            The subtitle of the other research product.
        tool (Optional[List[str]]):
            The tool of the other research product.
        type (Optional[str]):
            The type of the other research product.
    """

    affiliation: Optional[List[Affiliation]]
    author: Optional[List[Author]]
    best_access_right: Optional[BestAccessRight]
    collected_from: Optional[KeyValueModel]
    contact_group: Optional[List[str]]
    contact_person: Optional[List[str]]
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
    tool: Optional[List[str]]
    type: Optional[str]
