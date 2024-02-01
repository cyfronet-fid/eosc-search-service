"""Solr functions error handling"""

from json import JSONDecodeError

from fastapi import HTTPException
from httpx import Response, TransportError
from starlette import status


class SolrDocumentNotFoundError(HTTPException):
    """Error raised if requested document is not found in a given Solr collection"""

    status_code: status = status.HTTP_404_NOT_FOUND
    detail: str = "Requested document does not exist."

    def __init__(self):
        super().__init__(status_code=self.status_code, detail=self.detail)


class SolrCollectionNotFoundError(HTTPException):
    """Error raised if requested collection is not present in a configured Solr instance"""

    status_code: status = status.HTTP_404_NOT_FOUND
    detail: str = "Possible mismatch in collection name."

    def __init__(self):
        super().__init__(status_code=self.status_code, detail=self.detail)


class SolrCollectionEmptyError(HTTPException):
    """Error raised if the collection is empty"""

    status_code: status = status.HTTP_404_NOT_FOUND
    detail: str = "Collection is empty"

    def __init__(self):
        super().__init__(status_code=self.status_code, detail=self.detail)


class SolrUnknownError(HTTPException):
    """Unknown Solr errors"""

    def __init__(self, status_code: status, detail: str):
        super().__init__(status_code=status_code, detail=detail)


async def handle_solr_detail_response_errors(solr_request_coroutine) -> Response:
    """Wrap solr detail requests to handle errors"""
    try:
        response = await solr_request_coroutine
    except TransportError as e:
        raise HTTPException(status_code=500, detail="Try again later") from e
    if response.status_code == 404:
        raise SolrCollectionNotFoundError()
    if response.is_error:
        try:
            detail = response.json()["error"]["msg"]
        except (KeyError, JSONDecodeError):
            detail = "Unknown error structure"
        raise SolrUnknownError(status_code=response.status_code, detail=detail)
    if response.json()["doc"] is None:
        raise SolrDocumentNotFoundError()
    return response


async def handle_solr_list_response_errors(solr_request_coroutine) -> Response:
    """Wrap solr list requests to handle errors"""
    try:
        response = await solr_request_coroutine
    except TransportError as e:
        raise HTTPException(status_code=500, detail="Try again later") from e
    if response.status_code == 404:
        raise SolrCollectionNotFoundError()
    if response.is_error:
        try:
            detail = response.json()["error"]["msg"]
        except (KeyError, JSONDecodeError):
            detail = "Unknown error structure"
        raise SolrUnknownError(status_code=response.status_code, detail=detail)
    return response
