"""Dataset expected input schema"""

from typing import List, Optional, Union

from pydantic import BaseModel

from schemas.common.oag.affiliation import Affiliation
from schemas.common.oag.author import Author
from schemas.common.oag.best_access_right import BestAccessRight
from schemas.common.oag.context import Context
from schemas.common.oag.country import Country
from schemas.common.oag.eosc_if import EoscIf
from schemas.common.oag.geolocation import GeoLocation
from schemas.common.oag.indicator import Indicator
from schemas.common.oag.instance import Instance
from schemas.common.oag.key_value_model import KeyValueModel
from schemas.common.oag.language import Language
from schemas.common.oag.pid import PID
from schemas.common.oag.project import Project
from schemas.common.oag.relation import Relation
from schemas.common.oag.subject import Subject


class DatasetInputSchema(BaseModel):
    """
    Pydantic model representing the expected input schema for a dataset.

    Attributes:
        affiliation (Optional[List[Affiliation]]):
            A list of affiliation details for the dataset.
        author (Optional[List[Author]]):
            A list of author details for the dataset.
        best_access_right (Optional[BestAccessRight]):
            The best access right for the dataset.
        collected_from (Optional[KeyValueModel]):
            Information about the source of the dataset.
        context (Optional[Context]):
            The context of the dataset.
        contributor (Optional[List[str]]):
            A list of contributors for the dataset.
        country (Optional[Country]):
            The country details of the dataset.
        coverage (Optional[List[str]]):
            A list of coverage details for the dataset.
        date_of_collection (Optional[str]):
            The date of collection for the dataset.
        description (Optional[List[str]]):
            A list of descriptions for the dataset.
        embargo_end_date (Optional[str]):
            The end date of the embargo for the dataset.
        eosc_if (Optional[EoscIf]):
            The EOSC IF details for the dataset.
        format (Optional[List[str]]):
            A list of formats for the dataset.
        geolocation (Optional[List[GeoLocation]]):
            A list of geolocation details for the dataset.
        id (str):
            The unique identifier of the dataset.
        indicator (Optional[Indicator]):
            The indicator details for the dataset.
        instance (Optional[Instance]):
            The instance details for the dataset.
        keywords (Optional[List[str]]):
            A list of keywords for the dataset.
        language (Optional[Language]):
            The language details for the dataset.
        last_update_timestamp (Optional[int]):
            The last update timestamp for the dataset.
        main_title (Optional[str]):
            The main title of the dataset.
        original_id (Optional[List[str]]):
            A list of original identifiers for the dataset.
        pid (Optional[List[PID]]):
            A list of persistent identifiers for the dataset.
        projects (Optional[List[Project]]):
            A list of project details for the dataset.
        publication_date (Optional[str]):
            The publication date for the dataset.
        publisher (Optional[str]):
            The publisher of the dataset.
        relations (Optional[List[Relation]]):
            A list of relation details for the dataset.
        size (Optional[str]):
            The size of the dataset.
        source (Optional[List[Union[str, None]]]):
            A list of source details for the dataset.
        subject (Optional[Subject]):
            The subject details for the dataset.
        subtitle (Optional[str]):
            The subtitle of the dataset.
        type (Optional[str]):
            The type of the dataset.
        version (Optional[str]):
            The version of the dataset.
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
    embargo_end_date: Optional[str]
    eosc_if: Optional[EoscIf]
    format: Optional[List[str]]
    geolocation: Optional[List[GeoLocation]]
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
    size: Optional[str]
    source: Optional[List[Union[str, None]]]
    subject: Optional[Subject]
    subtitle: Optional[str]
    type: Optional[str]
    version: Optional[str]
