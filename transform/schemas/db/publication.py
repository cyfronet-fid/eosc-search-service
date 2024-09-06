"""Publication expected db schema"""

from datetime import datetime
from typing import List, Optional

from pydantic import AnyHttpUrl, BaseModel

from schemas.common.oag.affiliation import Affiliation
from schemas.common.oag.author import Author
from schemas.common.oag.container import Container
from schemas.common.oag.context import Context
from schemas.common.oag.indicator import Indicator
from schemas.common.oag.instance import Instance
from schemas.common.oag.key_value_model import KeyValueModel
from schemas.common.oag.pid import PID
from schemas.common.oag.project import Project
from schemas.common.oag.relation import Relation
from schemas.common.oag.subject import Subject


class PublicationDBSchema(BaseModel):
    """
    Pydantic model representing the expected db schema for a publication data type.

    Attributes:
        affiliation (Optional[List[Affiliation]]):
            A list of affiliation details for the publication.
        author (Optional[List[Author]]):
            A list of author details for the publication.
        author_names (List[str]):
            A list of author names associated with the publication.
        author_pids (List[List[str]]):
            A list of lists containing persistent identifiers (PIDs) for the authors.
        best_access_right (str):
            The best available access rights for the publication.
        collected_from (Optional[KeyValueModel]):
            The source of the publication.
        container (Optional[Container]):
            The container details of the publication.
        context (Optional[Context]):
            The context details of the publication.
        catalogue (str):
            The primary catalogue associated with the publication.
        catalogues (List[str]):
            A list of additional catalogues associated with the publication.
        container (str):
            The container associated with the publication.
        contributor (List[str]):
            A list of contributors to the publication.
        country (List[str]):
            A list of countries related to the publication.
        coverage (List[str]):
            A list of coverage details for the publication.
        datasource_pids (List[str]):
            A list of persistent identifiers (PIDs) for the data sources.
        date_of_collection (datetime):
            The date when the publication was collected (ISO 8601 format).
        description (List[str]):
            A list of descriptions for the publication.
        direct_url (List[AnyHttpUrl]):
            A list of direct URLs pointing to the publication.
        document_type (List[str]):
            A list of document types associated with the publication.
        doi (List[str]):
            A list of Digital Object Identifiers (DOIs) for the publication.
        embargo_end_date (datetime):
            The end date of the embargo for the publication (ISO 8601 format).
        eosc_if (List[str]):
            TODO: Add description.
        exportation (List[str]):
            A list of exportation formats or related details.
        format (str):
            A format associated with the publication.
        funder (List[str]):
            A list of funders associated with the publication.
        id (str):
            Unique identifier for the publication.
        indicator (Optional[Indicator]):
            The indicator details for the publication.
        instance (Optional[Instance]):
            The instance details for the publication.
        keywords (List[str]):
            A list of keywords associated with the publication.
        language (List[str]):
            A list of languages in which the publication is available.
        last_update_timestamp (datetime):
            The timestamp of the last update for the publication (ISO 8601 format).
        open_access (bool):
            Indicator of whether the publication is open access.
        original_id (str):
            The original identifier of the publication.
        pid (Optional[List[PID]]):
            A list of persistent identifiers for the publication.
        projects (Optional[List[Project]]):
            A list of project details for the publication.
        popularity (int):
            Popularity score of the publication.
        publication_date (datetime):
            The date when the publication was published (ISO 8601 format).
        publisher (str):
            The publisher of the publication.
        related_organisation_titles (List[str]):
            A list of titles of organizations related to the publication.
        related_project_ids (List[str]):
            A list of project identifiers related to the publication.
        relation_field (Optional[List[Relation]]):
            A list of relation_field details for the dataset.
        relations (List[str]):
            A list of relations to other publications or resources.
        relations_long (List[str]):
            A list of detailed relations to other publications or resources.
        research_community (List[str]):
            A list of research communities relevant to the publication.
        scientific_domains (List[str]):
            A list of scientific domains that the publication pertains to.
        sdg (List[str]):
            A list of SDGs associated with the publication.
        source (List[str]):
            A list of sources from which the publication was derived.
        subject (Optional[Subject]):
            The subject details for the publication.
        subtitle (str):
            The subtitle of the publication.
        title (str):
            The title of the publication.
        type (str):
            Data type, which is expected to be "publication".
        unified_categories (List[str]):
            A list of unified categories for the publication.
        url (List[AnyHttpUrl]):
            A list of URLs associated with the publication.
        usage_counts_downloads (str):
            The number of times the publication has been downloaded.
        usage_counts_views (str):
            The number of times the publication has been viewed.
    """

    affiliation: Optional[List[Affiliation]]
    author: Optional[List[Author]]
    author_names: List[str]
    author_pids: List[List[str]]
    best_access_right: str
    collected_from: Optional[KeyValueModel]
    container: Optional[Container]
    context: Optional[Context]
    catalogue: str
    catalogues: List[str]
    container: str
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
    relation_field: Optional[List[Relation]]
    relations: List[str]
    relations_long: List[str]
    research_community: List[str]
    scientific_domains: List[str]
    sdg: List[str]
    source: List[str]
    subject: Optional[Subject]
    subtitle: str
    title: str
    type: str
    unified_categories: List[str]
    url: List[AnyHttpUrl]
    usage_counts_downloads: str  # It could benefit from being int
    usage_counts_views: str  # It could benefit from being int

    """
    Transformations necessary to convert publication oag results
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
            "indicator",
            "instance",
            "projects",
            "pid",
            "relations",
            "subject",
            
        - TODO:
            date_of_collection from 2020-05-29T12:31:43.313Z to datetime
    """
