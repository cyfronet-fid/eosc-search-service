"""Endpoint for fetching the bibliography data for export and citations"""

import asyncio
import logging

from fastapi import APIRouter
from httpx import AsyncClient, HTTPError

from app.consts import DOI_BASE_URL
from app.schemas.bibliography_response import (
    CONTENT_TYPES_MAPPING,
    ERROR_MESSAGES_MAP,
    RETRY_ERROR_STATUS_CODES,
    BibliographyRecordErrorResponse,
    BibliographyRecordResponse,
    CitationEmptyResponse,
    CitationResponse,
    CitationStyle,
    EntryFormat,
)

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/bibliography-export-all-formats", name="web:export_all_formats")
async def bibliography_export_all_formats(pid: str):
    """
    Main function responsible for fetching 3 bibliography formats for a given DOI.
    Args:
        pid(str): PID of a document (currently only DOI) to fetch the data for.
    """
    gathered_results = await asyncio.gather(*[
        _get_bibliography_record(pid=pid, entry_format=entry_format)
        for entry_format in EntryFormat
    ])
    filtered_results = []
    for result in gathered_results:
        if isinstance(result, BibliographyRecordResponse):
            filtered_results.append(result)
        else:
            logger.info("****EXPORT ERROR****")
            logger.info(result.dict())
            logger.info("****EXPORT ERROR****")
    return filtered_results


async def _get_bibliography_record(
    pid: str, entry_format: EntryFormat
) -> [BibliographyRecordResponse | BibliographyRecordErrorResponse]:
    """
    Helper function fetching bibliography data in a given format for a requested document.
    Args:
        pid: PID of the document (currently only DOI)
        entry_format: requested format (BibTeX, RIS or JSON-LD)
    """
    content_type = CONTENT_TYPES_MAPPING[entry_format]
    async with AsyncClient() as client:
        headers = {"Accept": content_type}
        url = f"{DOI_BASE_URL}/{pid}"
        try:
            response = await client.get(url=url, headers=headers, follow_redirects=True)
        except HTTPError as err:
            return BibliographyRecordErrorResponse(
                pid=pid, type=entry_format, record=repr(err)
            )
        if response.status_code == 200:
            return BibliographyRecordResponse(
                type=entry_format, record=response.content
            )
        message = ERROR_MESSAGES_MAP.get(response.status_code)
        if not message and response.status_code >= 500:
            message = "Server is not responding. Try again later"
        return BibliographyRecordErrorResponse(
            pid=pid,
            type=entry_format,
            record=message,
            error_status_code=response.status_code,
        )


@router.get("/bibliography-cite", name="web:cite")
async def get_citation(pid: str, style: CitationStyle):
    """
    Main function responsible for returning the citation for a document in a given style.
    Logs error responses and returns only successful ones.
    Args:
        PID of the document (currently only DOI)
        style: one of the supported citation formats
    """
    response = await _get_citation(pid=pid, style=style)
    if isinstance(response, CitationResponse):
        return response

    if response.error_status_code in RETRY_ERROR_STATUS_CODES:
        response = await _get_citation(pid=pid, style=style)
        if isinstance(response, CitationResponse):
            return response
    logger.info("****CITATION ERROR****")
    logger.info(response.dict())
    logger.info("****CITATION ERROR****")
    return {"error": "Citation not available"}


async def _get_citation(pid: str, style: CitationStyle):
    """
    Helper function responsible for fetching the citation for a document in the requested style.
    Args:
        PID of the document (currently only DOI)
        style: one of the supported citation formats
    """
    async with AsyncClient() as client:
        headers = {"Accept": f"text/x-bibliography; style={style}"}
        try:
            response = await client.get(
                f"{DOI_BASE_URL}/{pid}", headers=headers, follow_redirects=True
            )
            if response.status_code == 200:
                return CitationResponse(style=style, citation=response.content)
            return CitationEmptyResponse(
                doi=pid,
                style=style,
                error_status_code=response.status_code,
                error=response.json()["message"]["message"],
            )
        except HTTPError as err:
            return CitationEmptyResponse(doi=pid, style=style, error=repr(err))
