import logging

import requests
from requests.exceptions import ConnectionError as ReqConnectionError

from app.services.solr.utils import get_default_headers

logger = logging.getLogger(__name__)


def send_str_to_solr(
    data: str,
    solr_url: str,
    collections: list[str],
    file_key: str = "",
    headers: dict = None,
) -> None:
    """
    Sends JSON data to Solr collections.

    Args:
        data (str): JSON data as a string.
        solr_url (str): Solr base URL.
        collections (list[str]): List of Solr collection names.
        file_key (str): An identifier for logging.
        headers (dict): HTTP headers for the request.

    Raises:
        ReqConnectionError: If there is a connection issue with Solr.
        Exception: For any unexpected errors during the Solr request.
    """
    headers = headers or get_default_headers()

    for collection in collections:
        url = f"{solr_url.rstrip('/')}/solr/{collection}/update?commitWithin=100"

        try:
            response = requests.post(url, data=data, headers=headers, timeout=180)
            if response.status_code != 200:
                logger.error(
                    "Failed to send data to Solr. file_key: %s, collection: %s status_code: %s. response %s, url %s",
                    file_key,
                    collection,
                    response.status_code,
                    response,
                    url,
                )
            else:
                logger.info(
                    "Data successfully sent to Solr. file_key: %s, collection: %s.",
                    file_key,
                    collection,
                )
        except ReqConnectionError as e:
            logger.error(
                "Connection error while sending data to Solr. file_key: %s, collection: %s, error: %s.",
                file_key,
                collection,
                str(e),
            )
        except Exception as e:
            logger.exception(
                "An unexpected error occurred while sending data to Solr. file_key: %s, collection: %s, error: %s.",
                file_key,
                collection,
                str(e),
            )
