"""Other research products expected db schema"""

from datetime import datetime
from typing import List, Optional

from pydantic import AnyHttpUrl, BaseModel

from schemas.common.oag.affiliation import Affiliation
from schemas.common.oag.author import Author
from schemas.common.oag.context import Context
from schemas.common.oag.indicator import Indicator
from schemas.common.oag.instance import Instance
from schemas.common.oag.key_value_model import KeyValueModel
from schemas.common.oag.pid import PID
from schemas.common.oag.project import Project
from schemas.common.oag.relation import Relation
from schemas.common.oag.subject import Subject


class OtherResearchProductDBSchema(BaseModel):
    """
    Pydantic model representing the expected db schema for a other_rp data type.

    Attributes:
        affiliation (Optional[List[Affiliation]]):
            A list of affiliation details for the other research product.
        author (Optional[List[Author]]):
            A list of author details for the other research product.
        author_names (List[str]):
            A list of author names associated with the other_rp.
        author_pids (List[List[str]]):
            A list of lists containing persistent identifiers (PIDs) for the authors.
        best_access_right (str):
            The best available access rights for the other_rp.
        collected_from (Optional[KeyValueModel]):
            The collection source details for the other research product.
        catalogue (str):
            The primary catalogue associated with the other_rp.
        catalogues (List[str]):
            A list of additional catalogues associated with the other_rp.
        contributor (List[str]):
            A list of contributors to the other_rp.
        contact_group (List[str]):
            A list of contact groups related to the other_rp.
        contact_person (List[str]):
            A list of contact persons related to the other_rp.
        context (Optional[Context]):
            The context details for the other research product.
        country (List[str]):
            A list of countries related to the other_rp.
        coverage (List[str]):
            A list of coverage details for the other_rp.
        datasource_pids (List[str]):
            A list of persistent identifiers (PIDs) for the data sources.
        date_of_collection (datetime):
            The date when the other_rp was collected (ISO 8601 format).
        description (List[str]):
            A list of descriptions for the other_rp.
        direct_url (List[AnyHttpUrl]):
            A list of direct URLs pointing to the other_rp.
        document_type (List[str]):
            A list of document types associated with the other_rp.
        doi (List[str]):
            A list of Digital Object Identifiers (DOIs) for the other_rp.
        embargo_end_date (datetime):
            The end date of the embargo for the other_rp (ISO 8601 format).
        eosc_if (List[str]):
            TODO: Add description.
        exportation (List[str]):
            A list of exportation formats or related details.
        format (str):
            A format associated with the other_rp.
        funder (List[str]):
            A list of funders associated with the other_rp.
        id (str):
            Unique identifier for the other_rp.
        indicator (Optional[Indicator]):
            The indicator details for the other research product.
        instance (Optional[Instance]):
            The instance details for the other research product.
        keywords (List[str]):
            A list of keywords associated with the other_rp.
        language (List[str]):
            A list of languages in which the other_rp is available.
        last_update_timestamp (datetime):
            The timestamp of the last update for the other_rp (ISO 8601 format).
        open_access (bool):
            Indicator of whether the other_rp is open access.
        original_id (str):
            The original identifier of the other_rp.
        pid (Optional[List[PID]]):
            A list of persistent identifiers for the other research product.
        projects (Optional[List[Project]]):
            A list of project details for the other research product.
        popularity (int):
            Popularity score of the other_rp.
        publication_date (datetime):
            The date when the other_rp was published (ISO 8601 format).
        publisher (str):
            The publisher of the other_rp.
        related_organisation_titles (List[str]):
            A list of titles of organizations related to the other_rp.
        related_project_ids (List[str]):
            A list of project identifiers related to the other_rp.
        relation_field (Optional[List[Relation]]):
            A list of relation_field details for the dataset.
        relations (List[str]):
            A list of relations to other other_rps or resources.
        relations_long (List[str]):
            A list of detailed relations to other other_rps or resources.
        research_community (List[str]):
            A list of research communities relevant to the other_rp.
        scientific_domains (List[str]):
            A list of scientific domains that the other_rp pertains to.
        sdg (List[str]):
            A list of SDGs associated with the other_rp.
        source (List[str]):
            A list of sources from which the other_rp was derived.
        subject (Optional[Subject]):
            The subject details for the other research product.
        subtitle (str):
            The subtitle of the other_rp.
        title (str):
            The title of the other_rp.
        type (str):
            Data type, which is expected to be "other_rp".
        unified_categories (List[str]):
            A list of unified categories for the other_rp.
        url (List[AnyHttpUrl]):
            A list of URLs associated with the other_rp.
        usage_counts_downloads (str):
            The number of times the other_rp has been downloaded.
        usage_counts_views (str):
            The number of times the other_rp has been viewed.
    """

    affiliation: Optional[List[Affiliation]]
    author: Optional[List[Author]]
    author_names: List[str]
    author_pids: List[List[str]]
    best_access_right: str
    collected_from: Optional[KeyValueModel]
    catalogue: str
    catalogues: List[str]
    contact_group: List[str]
    contact_person: List[str]
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
    tool: str
    type: str
    unified_categories: List[str]
    url: List[AnyHttpUrl]
    usage_counts_downloads: str  # It could benefit from being int
    usage_counts_views: str  # It could benefit from being int

    """
    Transformations necessary to convert other_rp oag results
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
