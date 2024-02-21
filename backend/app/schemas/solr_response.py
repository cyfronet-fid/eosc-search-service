"""Models for Solr requests"""

from typing import Dict, Optional

from pydantic import BaseModel

from app.consts import Collection


class SolrResponse(BaseModel):
    """Model for data returned from Solr list requests"""

    collection: Collection
    data: Dict


class RelatedService(BaseModel):
    """Model for a related service attached to an interoperability guideline"""

    pid: str
    best_access_right: str
    title: str
    resource_organisation: str
    tagline: str
    joined_categories: list
    type: str


class ExportData(BaseModel):
    """Model for data related to export and cite functionalities"""

    url: str
    document_type: str
    publication_year: Optional[str] = None
    license: Optional[str] = None
    hostedby: str
    extracted_doi: Optional[str] = None

    def serialize_to_camel_case(self):
        """Serializes response to the format expected by front-end"""
        data_dict = self.dict()
        data_dict = {self.snake_to_camel(key): val for key, val in data_dict.items()}
        return data_dict

    def snake_to_camel(self, key):
        """Serializes each key to the format expected by front-end"""
        split_key = key.split("_")
        camel_key = split_key[0]
        for part in split_key[1:]:
            camel_key += part.capitalize()
        return camel_key


class OrganisationResponse(BaseModel):
    """Model for a single organisation object"""

    id: str
    country: str
    title: str
    abbreviation: str
    type: str
    url: str
    alternative_names: list[str]
    related_publication_number: Optional[int] = None
    related_dataset_number: Optional[int] = None
    related_other_number: Optional[int] = None
    related_project_number: Optional[int] = None
    related_software_number: Optional[int] = None
