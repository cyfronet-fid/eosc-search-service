import asyncio
import logging
from typing import Dict, Union, Any
from enum import Enum
from pydantic import BaseModel
from fastapi import APIRouter
from httpx import AsyncClient, HTTPError
from bibtexparser import bparser


router = APIRouter()
logger = logging.getLogger(__name__)


class EntryFormat(Enum):
    bibtex = "bibtex"
    ris = "ris"
    json_ld = "json_ld"


class BibliographyRecordResponse(BaseModel):
    type: EntryFormat
    record: Union[str, Any]


class BibliographyRecordEmptyResponse(BaseModel):
    type: EntryFormat
    record: str


CONTENT_TYPES_MAPPING: Dict[EntryFormat, str] = {
    EntryFormat.bibtex: "application/x-bibtex",
    EntryFormat.ris: "application/x-research-info-systems",
    EntryFormat.json_ld: "application/vnd.schemaorg.ld+json"
}

DOI_BASE_URL = 'http://doi.org'


@router.get("/bibliography-export-all-formats", name="web:export_all_formats")
async def bibliography_export_all_formats(pid: str):
    gathered_results = await asyncio.gather(
        *[
            _get_bibliography_record(pid=pid, entry_format=entry_format)
            for entry_format in EntryFormat
        ]
    )
    filtered_results = [result for result in gathered_results if isinstance(result, BibliographyRecordResponse)]
    return filtered_results


@router.get("/bibliography-export", name="web:export")
async def bibliography_export(pid: str, entry_format: EntryFormat):
    result = await _get_bibliography_record(pid=pid, entry_format=entry_format)
    return result.record


async def _get_bibliography_record(
        pid: str, entry_format: EntryFormat
) -> [BibliographyRecordResponse | BibliographyRecordEmptyResponse]:
    content_type = CONTENT_TYPES_MAPPING[entry_format]
    async with AsyncClient() as client:
        headers = {'Accept': content_type}
        url = f"{DOI_BASE_URL}/{pid}"
        try:
            response = await client.get(url=url, headers=headers, follow_redirects=True)
            if response.status_code == 200:
                return BibliographyRecordResponse(type=entry_format, record=response.content)
            if response.status_code == 204:
                return BibliographyRecordEmptyResponse(type=entry_format, record="The metadata is not available")
            if response.status_code == 404:
                return BibliographyRecordEmptyResponse(type=entry_format, record="This DOI does not exist")
            if response.status_code == 406:
                return BibliographyRecordEmptyResponse(type=entry_format, record="This format is not available")
            if response.status_code >= 500:
                return BibliographyRecordEmptyResponse(type=entry_format, record="Server is not responding. Try again later")
        except HTTPError:
            return BibliographyRecordEmptyResponse(type=entry_format, record="Something went wrong :D")
