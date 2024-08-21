"""Software expected db schema"""

from datetime import datetime
from pydantic import AnyHttpUrl, BaseModel
from typing import List


class SoftwareDBSchema(BaseModel):
    """
    Pydantic model representing the expected db schema for a software data type.

    Attributes:
        author_names (List[str]):
            A list of author names associated with the software.
        author_names_tg (List[str]):
            A list of author names in a target language or transliteration.
        author_pids (List[List[str]]):
            A list of lists containing persistent identifiers (PIDs) for the authors.
        best_access_right (str):
            The best available access rights for the software.
        catalogue (str):
            The primary catalogue associated with the software.
        catalogues (List[str]):
            A list of additional catalogues associated with the software.
        country (List[str]):
            A list of countries related to the software.
        datasource_pids (List[str]):
            A list of persistent identifiers (PIDs) for the data sources.
        description (List[str]):
            A list of descriptions for the software.
        direct_url (List[AnyHttpUrl]):
            A list of direct URLs pointing to the software.
        document_type (List[str]):
            A list of document types associated with the software.
        documentation_url (List[str]):
            A list of URLs related to documentation for the software.
        doi (List[str]):
            A list of Digital Object Identifiers (DOIs) for the software.
        eosc_if (List[str]):
            TODO: Add description.
        exportation (List[str]):
            A list of exportation formats or related details.
        funder (List[str]):
            A list of funders associated with the software.
        id (str):
            Unique identifier for the software.
        keywords (List[str]):
            A list of keywords associated with the software.
        keywords_tg (List[str]):
            A list of keywords in a target language or transliteration.
        language (List[str]):
            A list of languages in which the software is available.
        open_access (bool):
            Indicator of whether the software is open access.
        popularity (int):
            Popularity score of the software.
        publication_date (datetime):
            The date when the software was published (ISO 8601 format).
        publisher (str):
            The publisher of the software.
        related_organisation_titles (List[str]):
            A list of titles of organizations related to the software.
        related_project_ids (List[str]):
            A list of project identifiers related to the software.
        relations (List[str]):
            A list of relations to other software or resources.
        relations_long (List[str]):
            A list of detailed relations to other software or resources.
        research_community (List[str]):
            A list of research communities relevant to the software.
        scientific_domains (List[str]):
            A list of scientific domains that the software pertains to.
        sdg (List[str]):
            A list of SDGs associated with the software.
        source (List[str]):
            A list of sources from which the software was derived.
        subtitle (str):
            The subtitle of the software.
        title (str):
            The title of the software.
        type (str):
            Data type, which is expected to be "software".
        unified_categories (List[str]):
            A list of unified categories for the software.
        url (List[AnyHttpUrl]):
            A list of URLs associated with the software.
        usage_counts_downloads (str):
            The number of times the software has been downloaded.
        usage_counts_views (str):
            The number of times the software has been viewed.
    """
    author_names: List[str]
    author_names_tg: List[str]
    author_pids: List[List[str]]
    best_access_right: str
    catalogue: str
    catalogues: List[str]
    country: List[str]
    datasource_pids: List[str]
    description: List[str]
    direct_url: List[AnyHttpUrl]
    document_type: List[str]
    documentation_url: List[str]
    doi: List[str]
    eosc_if: List[str]
    exportation: List[str]
    funder: List[str]
    id: str
    keywords: List[str]
    keywords_tg: List[str]
    language: List[str]
    open_access: bool
    popularity: int
    publication_date: datetime  # TODO check date format
    publisher: str
    related_organisation_titles: List[str]
    related_project_ids: List[str]
    relations: List[str]
    relations_long: List[str]
    research_community: List[str]
    scientific_domains: List[str]
    sdg: List[str]
    source: List[str]
    subtitle: str
    title: str
    type: str
    unified_categories: List[str]
    url: List[AnyHttpUrl]
    usage_counts_downloads: str  # It could benefit from being int
    usage_counts_views: str  # It could benefit from being int

    """Transformations necessary to convert software oag results
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
        "contributor",
        "country",
        "coverage",
        "dateofcollection",
        "embargoenddate",
        "eoscIF",
        "format",
        "indicator",
        "instance",
        "lastupdatetimestamp",
        "originalId",
        "projects",
        "pid",
        "relations",
        "subject",
    """