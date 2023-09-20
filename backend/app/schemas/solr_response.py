"""Models for Solr requests"""
from typing import Dict

from pydantic import BaseModel

from app.consts import Collection


class SolrResponse(BaseModel):
    """Model for data returned from Solr list requests"""

    collection: Collection
    data: Dict
