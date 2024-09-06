"""Other research product expected search engine schema"""

from datetime import date
from typing import List

from pydantic import BaseModel


class OtherResearchProductSESchema(BaseModel):
    """
    Pydantic model representing the expected search engine schema for other research products after transformations.

    Attributes:
        author_names (List[str]):
            A list of author names associated with the research product. Used in filters and resource view.
        author_names_tg (List[str]):
            The same data as 'author_names' but in solr text general type. Used in searching.
        best_access_right (str):
            The best access right for the research product. Used in filters.
        catalogue (str):
            # TODO move only to catalogues
            The catalogue associated with the research product.
        catalogues (List[str]):
            A list of catalogues associated with the research product.
        country (List[str]):
            A list of countries associated with the research product. Used in filters.
        datasource_pids (List[str]):
            A list of persistent identifiers (PIDs) for the datasource. Used in filters.
        description (List[str]):
            A list of descriptions for the research product. Used in searching.
        document_type (List[str]):
            A list of document types for the research product. Used in filters and resource view.
        doi (List[str]):
            A list of DOIs (Digital Object Identifiers) for the research product. Used in tags.
        eosc_if (List[str]):
            # TODO add description. Used in secondary tags.
        exportation (List[str]):
            A list of exportation information for the research product. Used in resource view.
        funder (List[str]):
            A list of funders associated with the research product. Used in filters.
        id (str):
            Unique identifier for the research product.
        keywords (List[str]):
            A list of keywords associated with the research product. Used in filters and tags.
        keywords_tg (List[str]):
            The same data as 'keywords' but in solr text general type. Used in searching.
        language (List[str]):
            A list of languages in which the research product is available. Used in filters and resource view.
        open_access (bool):
            # TODO is it used?
            Indicates whether the research product is open access.
        popularity (int):
            Popularity score of the research product. Used in sorting.
        publication_date (date):
            The date when the research product was published. Used in sorting.
        publisher (str):
            The publisher of the research product. Used in filters.
        related_organisation_titles (List[str]):
            # TODO consider moving to db
            A list of titles of related organisations.
        related_project_ids (List[str]):
            # TODO consider moving to db
            A list of related project IDs.
        relations (List[str]):
            # TODO consider moving to db
            A list of relations associated with the research product.
        relations_long (List[str]):
            # TODO consider moving to db
            A detailed list of relations associated with the research product.
        research_community (List[str]):
            A list of research communities associated with the research product. Used in filters.
        scientific_domains (List[str]):
            A list of scientific domains associated with the research product. Used in filters and tags.
        sdg (List[str]):
            A list of Sustainable Development Goals (SDGs) associated with the research product. Used in filters.
        source (List[str]):
            A list of sources for the research product. Used in tags.
        title (str):
            The title of the research product. Used in searching
        type (str):
            Data type = "other". Used in tabs and resource view.
        unified_categories (List[str]):
            A list of unified categories for the research product. Used in filters.
        url (List[str]):
            A list of URLs related to the research product. Used in resource view
        usage_counts_downloads (str):
            The number of times the research product has been downloaded. Part of popularity.
        usage_counts_views (str):
            The number of times the research product has been viewed. Part of popularity.
    """

    author_names: List[str]
    author_names_tg: List[str]
    best_access_right: str
    catalogue: str  # TODO delete
    catalogues: List[str]  # TODO Is it used?
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
    source: List[str]
    title: str
    type: str
    unified_categories: List[str]
    url: List[str]
    usage_counts_downloads: str
    usage_counts_views: str

    """
    Transformations necessary to convert OtherResearchProductInputSchema to OtherResearchProductSESchema
        - add type = "other"
        - add author_pids
        - add contactgroup
        - add contactperson
        - add direct_url
        - add tool
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
