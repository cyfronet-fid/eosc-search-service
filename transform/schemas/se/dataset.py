"""Dataset expected search engine schema"""

from datetime import date
from typing import List

from pydantic import BaseModel


class DatasetSESchema(BaseModel):
    """
    Pydantic model representing the expected search engine schema for a dataset after transformations.

    Attributes:
        author_names (List[str]):
            A list of author names associated with the dataset. Used in tags.
        author_names_tg (List[str]):
            The same data as 'author_names' but in solr text general type. Used in searching.
        best_access_right (str):
            The best access right for the dataset. Used in filering.
        catalogue (str):
            # TODO replace with catalogues. Make sure that backend/frontend are not using it.
            The catalogue associated with the dataset.
        catalogues (List[str]):
            A list of catalogues associated with the dataset.
        country (List[str]):
            A list of countries associated with the dataset. Used in filtering.
        datasource_pids (List[str]):
            A list of persistent identifiers (PIDs) for the datasource. Used in filtering.
        description (List[str]):
            A list of descriptions for the dataset. used in searching.
        document_type (List[str]):
            A list of document types for the dataset. Used in filtering and resource view.
        doi (List[str]):
            A list of DOIs (Digital Object Identifiers) for the dataset. Used in filtering.
        eosc_if (List[str]):
            # TODO add description. Used in secondary tags
        exportation (List[str]):
            A list of exportation information for the dataset. Used in resource view.
        funder (List[str]):
            A list of funders associated with the dataset. Used in filtering.
        id (str):
            Unique identifier for the dataset.
        keywords (List[str]):
            A list of keywords associated with the dataset. Used in filtering and secondary tags
        keywords_tg (List[str]):
            The same data as 'keywords' but in solr text general type. Used in searching.
        language (List[str]):
            A list of languages in which the dataset is available. Used in filtering and resource view.
        open_access (bool):
            # TODO Saw no usage in the code. Dive deeper.
            Indicates whether the dataset is open access.
        popularity (int):
            Popularity score of the dataset. Used in sorting
        publication_date (date):
            The date when the dataset was published. Used in sorting.
        publisher (str):
            The publisher of the dataset. Used in filtering and tags.
        related_organisation_titles (List[str]):
            # TODO probably keep only in db - scope for other refactor
            A list of titles of related organisations.
        related_project_ids (List[str]):
            # TODO probably keep only in db - scope for other refactor
            A list of related project IDs.
        relations (List[str]):
            # TODO probably keep only in db - scope for other refactor
            A list of relations to other objects.
        relations_long (List[str]):
            # TODO probably keep only in db - scope for other refactor
            A detailed list of relations associated with the dataset.
        research_community (List[str]):
            A list of research communities associated with the dataset. Used in filtering
        scientific_domains (List[str]):
            A list of scientific domains associated with the dataset. Used in filtering and tags.
        sdg (List[str]):
            A list of Sustainable Development Goals (SDGs) associated with the dataset. Used in filtering.
        title (str):
            The title of the dataset. Used in searching.
        type (str):
            Data type = "dataset". Used in tabs and resource views.
        unified_categories (List[str]):
            A list of unified categories for the dataset. Used in filtering.
        url (List[str]):
            A list of URLs related to the dataset. Used in resource view.
        usage_counts_downloads (str):
            The number of times the dataset has been downloaded. Part of popularity.
        usage_counts_views (str):
            The number of times the dataset has been viewed. Part of popularity
    """

    author_names: List[str]
    author_names_tg: List[str]
    best_access_right: str
    catalogue: str  # TODO replace with catalogues. Make sure that backend/frontend are not using it.
    catalogues: List[str]  # TODO is it used?
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
    Transformations necessary to convert DatasetInputSchema to DatasetSESchema
        - add type = "dataset"
        - add author_pids
        - add direct_url
        - add size
        - add source
        - add subtitle
        - add version
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
            "geolocation",
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
