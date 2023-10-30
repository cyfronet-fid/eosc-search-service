import requests
from logging import getLogger
from utils.loader import load_env_vars
from schemas.properties.env import (
    ADDRESS,
    ALL_COLLECTION,
    BUNDLE,
    DATASOURCE,
    MP_API_TOKEN,
    OFFER,
    PROVIDER,
    SERVICE,
)

logger = getLogger(__name__)

env_vars = load_env_vars()


def get_data(data_type: str, data_address: str) -> list[dict] | None:
    try:
        if data_type in (SERVICE, DATASOURCE, PROVIDER, OFFER, BUNDLE):
            headers = {
                "accept": "application/json",
                "X-User-Token": env_vars[MP_API_TOKEN],
            }
            data = requests.get(data_address, headers=headers, timeout=1000).json()

        else:
            data = requests.get(data_address, timeout=20).json()["results"]

    except requests.ConnectionError:
        data = None
        logger.error(
            f"{data_type} - retrieving data from {data_address} failed. Unable to establish a connection to the server"
        )
    except requests.Timeout:
        data = None
        logger.error(
            f"{data_type} - retrieving data from {data_address} failed. The request timed out"
        )
    except requests.HTTPError as http_err:
        data = None
        logger.error(
            f"{data_type} - retrieving data from {data_address} failed. HTTP error occurred: {http_err}"
        )
    except requests.RequestException as err:
        data = None
        logger.error(
            f"{data_type} - retrieving data from {data_address} failed. An error occurred: {err}"
        )

    return data


def data_source_pids_list():
    """
        Returns a list of data source PIDs, ensuring a singleton pattern to initialize it only once.

    This function retrieves a list of data source PIDs from a data source and caches the result
    to ensure that the initialization logic is executed only once. Subsequent calls to this
    function will return the existing list of data source PIDs.

    Returns:
        list: A list of data source PIDs.

    Example:
        data_source_pids = data_source_pids_list()
    """
    if (
        not hasattr(data_source_pids_list, "_instance")
        or data_source_pids_list._instance is None
    ):
        data_source_pids_list._instance = [
            ds["pid"]
            for ds in get_data(
                DATASOURCE, env_vars[ALL_COLLECTION][DATASOURCE][ADDRESS]
            )
        ]
    return data_source_pids_list._instance
