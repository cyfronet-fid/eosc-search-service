"""Software expected search engine schema"""

from datetime import date
from typing import List

from pydantic import BaseModel


class SoftwareSESchema(BaseModel):
    """
    Pydantic model representing the expected search engine schema for software after transformations.

    Attributes:
        author_names (List[str]):
            A list of author names associated with the software. Used in filters and tags.
        author_names_tg (List[str]):
            The same data as 'author_names' but in solr text general type. Used in searching.
        best_access_right (str):
            The best access right for the software. Used in filters.
        catalogue (str):
            # TODO move only to catalogues
            The catalogue associated with the software.
        catalogues (List[str]):
            # TODO is it used?
            A list of catalogues associated with the software.
        country (List[str]):
            A list of countries associated with the software. Used in filters.
        datasource_pids (List[str]):
            A list of persistent identifiers (PIDs) for the datasource. Used in resource view.
        description (List[str]):
            A list of descriptions for the software. Used in searching.
        document_type (List[str]):
            A list of document types for the software. Used in filters.
        doi (List[str]):
            A list of DOIs (Digital Object Identifiers) for the software. Used in filters.
        eosc_if (List[str]):
            TODO add description. Used in secondary tags.
        exportation (List[str]):
            A list of exportation information for the software. Used in resource view.
        funder (List[str]):
            A list of funders associated with the software. Used in filters.
        id (str):
            Unique identifier for the software.
        keywords (List[str]):
            A list of keywords associated with the software. Used in filters and tags.
        keywords_tg (List[str]):
            The same data as 'keywords' but in solr text general type. Used in searching.
        language (List[str]):
            A list of languages in which the software is available. Used in filters and tags.
        open_access (bool):
            # TODO is it used?
            Indicates whether the software is open access.
        popularity (int):
            Popularity score of the software. Used in sorting.
        publication_date (date):
            The date when the software was published. Used in sorting.
        publisher (str):
            The publisher of the software. Used in filters and tags.
        related_organisation_titles (List[str]):
            # TODO consider moving to db
            A list of titles of related organisations.
        related_project_ids (List[str]):
            # TODO consider moving to db
            A list of related project IDs.
        relations (List[str]):
            # TODO consider moving to db
            A list of relations associated with the software.
        relations_long (List[str]):
            # TODO consider moving to db
            A detailed list of relations associated with the software.
        research_community (List[str]):
            A list of research communities associated with the software. Used in filters.
        scientific_domains (List[str]):
            A list of scientific domains associated with the software. Used in filters and tags.
        sdg (List[str]):
            A list of Sustainable Development Goals (SDGs) associated with the software. Used in filters.
        title (str):
            The title of the software. Used in searching.
        type (str):
            Data type = "software". Used in tabs and resource view.
        unified_categories (List[str]):
            A list of unified categories for the software. Used in filters.
        url (List[str]):
            A list of URLs related to the software. Used in resource view.
        usage_counts_downloads (str):
            The number of times the software has been downloaded. Part of popularity.
        usage_counts_views (str):
            The number of times the software has been viewed. Part of popularity.
    """

    author_names: List[str]
    author_names_tg: List[str]
    best_access_right: str
    catalogue: str  # TODO delete
    catalogues: List[str]
    country: List[str]
    datasource_pids: List[str]
    description: List[str]
    document_type: List[str]
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
    publication_date: date
    publisher: str
    related_organisation_titles: List[str]
    related_project_ids: List[str]
    relations: List[str]
    relations_long: List[str]
    research_community: List[str]
    scientific_domains: List[str]
    sdg: List[str]
    title: str
    type: str
    unified_categories: List[str]
    url: List[str]
    usage_counts_downloads: str
    usage_counts_views: str

    """
    Transformations necessary to convert SoftwareInputSchema to SoftwareSESchema
        - add type = "software"
        - add author_pids
        - add direct_url
        - add documentation_url
        - add programming_language
        - add source
        - add subtitle
        - delete:
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
        - apply current transformations
        - cast:
            df = transform_date(df, "publication_date", "yyyy-MM-dd")
            df = df.withColumn("publication_year", year(col("publication_date")))
        - rename:
            "bestaccessright": "best_access_right",
            "documentationUrl": "documentation_url",
            "programmingLanguage": "programming_language",
            "publicationdate": "publication_date",
            "maintitle": "title",
            "fulltext": "direct_url",
"""
