"""Dataset expected db schema"""

from datetime import datetime
from typing import List, Optional

from pydantic import AnyHttpUrl, BaseModel

from schemas.common.oag.affiliation import Affiliation
from schemas.common.oag.author import Author
from schemas.common.oag.context import Context
from schemas.common.oag.geolocation import GeoLocation
from schemas.common.oag.indicator import Indicator
from schemas.common.oag.instance import Instance
from schemas.common.oag.key_value_model import KeyValueModel
from schemas.common.oag.pid import PID
from schemas.common.oag.project import Project
from schemas.common.oag.relation import Relation
from schemas.common.oag.subject import Subject


class DatasetDBSchema(BaseModel):
    """
    Pydantic model representing the expected db schema for a dataset data type.

    Attributes:
        affiliation (Optional[List[Affiliation]]):
            A list of affiliation details for the dataset.
        author (Optional[List[Author]]):
            A list of author details for the dataset.
        author_names (List[str]):
            A list of author names associated with the dataset.
        author_pids (List[List[str]]):
            A list of lists containing persistent identifiers (PIDs) for the authors.
        best_access_right (str):
            The best available access rights for the dataset.
        collected_from (Optional[KeyValueModel]):
            Information about the source of the dataset.
        context (Optional[Context]):
            The context of the dataset.
        catalogue (str):
            The primary catalogue associated with the dataset.
        catalogues (List[str]):
            A list of additional catalogues associated with the dataset.
        contributor (List[str]):
            A list of contributors to the dataset.
        country (List[str]):
            A list of countries related to the dataset.
        coverage (List[str]):
            A list of coverage details for the dataset.
        datasource_pids (List[str]):
            A list of persistent identifiers (PIDs) for the data sources.
        date_of_collection (datetime):
            The date when the dataset was collected (ISO 8601 format).
        description (List[str]):
            A list of descriptions for the dataset.
        direct_url (List[AnyHttpUrl]):
            A list of direct URLs pointing to the dataset.
        document_type (List[str]):
            A list of document types associated with the dataset.
        doi (List[str]):
            A list of Digital Object Identifiers (DOIs) for the dataset.
        embargo_end_date (datetime):
            The end date of the embargo for the dataset (ISO 8601 format).
        eosc_if (List[str]):
            TODO: Add description.
        exportation (List[str]):
            A list of exportation formats or related details.
        format (str):
            A format associated with the dataset.
        geolocation (Optional[List[GeoLocation]]):
            A list of geolocation details for the dataset.
        funder (List[str]):
            A list of funders associated with the dataset.
        id (str):
            Unique identifier for the dataset.
        indicator (Optional[Indicator]):
            The indicator details for the dataset.
        instance (Optional[Instance]):
            The instance details for the dataset.
        keywords (List[str]):
            A list of keywords associated with the dataset.
        language (List[str]):
            A list of languages in which the dataset is available.
        last_update_timestamp (datetime):
            The timestamp of the last update for the dataset (ISO 8601 format).
        open_access (bool):
            Indicator of whether the dataset is open access.
        original_id (str):
            The original identifier of the dataset.
        popularity (int):
            Popularity score of the dataset.
        pid (Optional[List[PID]]):
            A list of persistent identifiers for the dataset.
        projects (Optional[List[Project]]):
            A list of project details for the dataset.
        publication_date (datetime):
            The date when the dataset was published (ISO 8601 format).
        publisher (str):
            The publisher of the dataset.
        related_organisation_titles (List[str]):
            A list of titles of organizations related to the dataset.
        related_project_ids (List[str]):
            A list of project identifiers related to the dataset.
        relation_field (Optional[List[Relation]]):
            A list of relation_field details for the dataset.
        relations (List[str]):
            A list of relations to other datasets or resources.
        relations_long (List[str]):
            A list of detailed relations to other datasets or resources.
        research_community (List[str]):
            A list of research communities relevant to the dataset.
        scientific_domains (List[str]):
            A list of scientific domains that the dataset pertains to.
        sdg (List[str]):
            A list of SDGs associated with the dataset.
        size (str):
            The size of the dataset.
        source (List[str]):
            A list of sources from which the dataset was derived.
        subject (Optional[Subject]):
            The subject details for the dataset.
        subtitle (str):
            The subtitle of the dataset.
        title (str):
            The title of the dataset.
        type (str):
            Data type, which is expected to be "dataset".
        unified_categories (List[str]):
            A list of unified categories for the dataset.
        url (List[AnyHttpUrl]):
            A list of URLs associated with the dataset.
        usage_counts_downloads (str):
            The number of times the dataset has been downloaded. Consider changing to `int`.
        usage_counts_views (str):
            The number of times the dataset has been viewed. Consider changing to `int`.
        version (str):
            The version of the dataset.
    """

    affiliation: Optional[List[Affiliation]]
    author: Optional[List[Author]]
    author_names: List[str]
    author_pids: List[List[str]]
    best_access_right: str
    catalogue: str
    catalogues: List[str]
    collected_from: Optional[KeyValueModel]
    context: Optional[Context]
    contributor: List[str]
    country: List[str]
    coverage: List[str]
    datasource_pids: List[str]
    date_of_collection: datetime
    description: List[str]
    direct_url: List[AnyHttpUrl]
    document_type: List[str]
    doi: List[str]
    embargo_end_date: datetime
    eosc_if: List[str]
    exportation: List[str]
    format: str
    funder: List[str]
    geolocation: Optional[List[GeoLocation]]
    id: str
    indicator: Optional[Indicator]
    instance: Optional[Instance]
    keywords: List[str]
    language: List[str]
    last_update_timestamp: datetime
    open_access: bool
    original_id: str
    pid: Optional[List[PID]]
    projects: Optional[List[Project]]
    popularity: int
    publication_date: datetime  # TODO check date format
    publisher: str
    related_organisation_titles: List[str]
    related_project_ids: List[str]
    relations: List[str]
    relations_long: List[str]
    relation_field: Optional[List[Relation]]
    research_community: List[str]
    scientific_domains: List[str]
    sdg: List[str]
    size: str
    source: List[str]
    subject: Optional[Subject]
    subtitle: str
    title: str
    type: str
    unified_categories: List[str]
    url: List[AnyHttpUrl]
    usage_counts_downloads: str  # It could benefit from being int
    usage_counts_views: str  # It could benefit from being int
    version: str

    """
    Transformations necessary to convert dataset oag results
        - add type = "dataset"
        - add best_access_right
        - add open_access
        - add language
        - add author_names & author_pids
        - add scientific_domains
        - add sdg
        - add funder
        - add url & document_type
        - add doi # TODO it should be pid / pids not doi since doi is type of pid
        - add country
        - add research_community
        - add relations & relations_long
        - add eosc_if
        - add popularity
        - add unified_categories
        - add exportation
        - add datasource_pids
        - add related_organisation_titles
        - add related_project_ids
        - rename:
            "bestaccessright": "best_access_right",
            "documentationUrl": "documentation_url",
            "programmingLanguage": "programming_language",
            "publicationdate": "publication_date",
            "maintitle": "title",
            "fulltext": "direct_url",
            "dateofcollection": "date_of_collection",
            "embargoenddate": "embargo_end_date",
            "eoscIF": "eosc_if",
            "lastupdatetimestamp": "last_update_timestamp",
            "originalId": "original_id",
        - do mappings:
            - map_publisher
        - simplyfies:
            - simplify_language
            - simplify_indicators
        - cast:
            transform_date(df, "publication_date", "yyyy-MM-dd")
            df.withColumn("publication_year", year(col("publication_date")))
        - cols_to_drop:
            "affiliation",
            "author",
            "collectedfrom",
            "context",
            "country",
            "geolocation",
            "indicator",
            "instance",
            "projects",
            "pid",
            "relations",
            "subject",
        - TODO:
            date_of_collection from 2020-05-29T12:31:43.313Z to datetime
    """
