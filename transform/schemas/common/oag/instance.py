from typing import List, Optional

from pydantic import AnyHttpUrl, BaseModel

from schemas.common.oag.article_processing_charge import ArticleProcessingCharge
from schemas.common.oag.best_access_right import BestAccessRight
from schemas.common.oag.key_value_model import KeyValueModel
from schemas.common.oag.pid import PID


class Instance(BaseModel):
    """
    Model representing an instance of a publication.

    Attributes:
        access_right (Optional[BestAccessRight]):
            The access right for the instance.
        alternate_identifier (Optional[List[PID]]):
            A list of alternate identifiers for the instance.
        article_processing_charge (Optional[dict]):
            The article processing charge details for the instance.
        eosc_ds_id (Optional[List[str]]):
            A list of EOSC DS IDs for the instance.
        full_text (Optional[str]):
            The full text of the instance.
        hosted_by (Optional[KeyValueModel]):
            Information about who hosts the instance.
        license (Optional[str]):
            The license for the instance.
        pid (Optional[List[PID]]):
            A list of persistent identifiers for the instance.
        publication_date (Optional[str]):
            The publication date of the instance.
        refereed (Optional[str]):
            Indicates if the instance is refereed.
        type (Optional[str]):
            The type of the instance.
        url (Optional[List[str]]):
            A list of URLs for the instance.
    """

    access_right: Optional[BestAccessRight]
    alternate_identifier: Optional[List[PID]]
    article_processing_charge: Optional[ArticleProcessingCharge]
    eosc_ds_id: Optional[List[str]]
    full_text: Optional[str]
    hosted_by: Optional[KeyValueModel]
    license: Optional[str]
    pid: Optional[List[PID]]
    publication_date: Optional[str]
    refereed: Optional[str]
    type: Optional[str]
    url: Optional[List[AnyHttpUrl]]
