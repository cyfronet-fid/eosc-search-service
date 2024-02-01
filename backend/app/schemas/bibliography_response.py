"""Models used by web.bibliography.py"""

from enum import Enum
from typing import Any, Dict, Literal, Optional, TypeAlias, Union

from pydantic import BaseModel

CitationStyle: TypeAlias = Literal[
    "apa",
    "harvard_cite_them_right",
    "harvard_cite_them_right_no_et_al",
    "vancouver",
    "chicago_annotated_bibliography",
    "mla",
]


class EntryFormat(Enum):
    """Supported export formats"""

    BIBTEX = "bibtex"
    RIS = "ris"
    JSON_LD = "json_ld"


class CitationEmptyResponse(BaseModel):
    """Error response model for citations"""

    doi: str
    style: CitationStyle
    error_status_code: Optional[int] = None
    error: str


class CitationResponse(BaseModel):
    """Response model for citations"""

    style: CitationStyle
    citation: str


class BibliographyRecordResponse(BaseModel):
    """Response model for export"""

    type: EntryFormat
    record: Union[str, Any]


class BibliographyRecordErrorResponse(BaseModel):
    """Error response model for export"""

    pid: str
    type: EntryFormat
    record: str = "Unknown error"
    error_status_code: Optional[int] = None


CONTENT_TYPES_MAPPING: Dict[EntryFormat, str] = {
    EntryFormat.BIBTEX: "application/x-bibtex",
    EntryFormat.RIS: "application/x-research-info-systems",
    EntryFormat.JSON_LD: "application/vnd.schemaorg.ld+json",
}


RETRY_ERROR_STATUS_CODES = [500, 502, 503, 504]

ERROR_MESSAGES_MAP = {
    204: "The metadata is not available",
    404: "Provided DOI does not exist",
    406: "Requested format is not available",
}
