"""Catalogue expected search engine schema"""

from datetime import date
from typing import List

from pydantic import BaseModel


class CatalogueSESchema(BaseModel):
    """
    Pydantic model representing the expected search engine schema for a catalogue after transformations.

    Attributes:
        abbreviation (str):
            The abbreviation of the catalogue. Used in the resource view.
        description (str):
            A detailed description of the catalogue. Used in searching.
        id (str):
            The unique identifier of the catalogue.
        keywords (List[str]):
            A list of keywords associated with the catalogue - solr strings type. Used in filters.
        keywords_tg (List[str]):
            The same data as 'keywords' but in solr: text general type. Used in searching.
        legal_status (str):
            The legal status of the catalogue. Used in tags.
        pid (str):
            The persistent identifier of the catalogue. Used in the resource view.
        publication_date (date):
            The date when the catalogue was published. Used in ordering and resource view.
        scientific_domains (List[str]):
            A list of scientific domains associated with the catalogue. Used in tags and filters.
        title (str):
            The title of the catalogue. Used in searching.
        type (str):
            Data type = "catalogue". Used in tabs and tags
    """

    abbreviation: str
    description: str
    id: str
    keywords: List[str]
    keywords_tg: List[str]
    legal_status: str
    pid: str
    publication_date: date
    scientific_domains: List[str]
    title: str
    type: str

    """
    Transformations necessary to convert CatalogueInputSchema to CatalogueSESchema
        - add type = "catalogue"
        - rename "name" to "title"
        - rename "tag_list" to "keywords"
        - rename "created_at" to "publication_date"
        - delete:
            "affiliations",
            "city",
            "country",
            "hosting_legal_entity",
            "legal_entity",
            "multimedia_urls",
            "networks",
            "participating_countries",
            "postal_code",
            "public_contacts",
            "region",
            "slug",
            "street_name_and_number",
            "updated_at",
            "webpage_url",
        - convert ID:
            df = df.withColumn(ID, (col(ID) + self.id_increment))
        - cast:
            .withColumn("publication_date", col("publication_date").cast("date")
    """
