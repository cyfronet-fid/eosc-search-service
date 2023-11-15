# pylint: disable=line-too-long, logging-fstring-interpolation
"""Retrieve data from the APIs of both the Marketplace and the Provider Component"""
import asyncio
from logging import getLogger
import requests
from app.transform.utils.loader import load_env_vars
from app.transform.schemas.properties.env import (
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


async def get_data(data_type: str, data_address: str) -> list[dict] | None:
    """Get data from the APIs of both MP and PC"""
    try:
        if data_type in (SERVICE, DATASOURCE, PROVIDER, OFFER, BUNDLE):
            headers = {
                "accept": "application/json",
                "X-User-Token": env_vars[MP_API_TOKEN],
            }
            data = requests.get(
                data_address,
                headers=headers,
                timeout=1000,
            ).json()
            await check_mp_auth(data)
        else:
            # Trainings, guidelines
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


async def check_mp_auth(data: dict | list[dict]) -> None:
    """Check if authorization was successful -> data was returned -> therefore data should be a list[dict].
    An error was returned -> dict"""
    if isinstance(data, dict):  # Most likely we have an error
        if "error" in data:
            if data["error"] == "You need to sign in or sign up before continuing.":
                raise requests.HTTPError("401 Client Error: Unauthorized")
            else:
                raise requests.RequestException(data["error"])


def data_source_pids_list():
    # TODO add reset pids after full oag transform
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
        data_sources = asyncio.run(
            get_data(DATASOURCE, env_vars[ALL_COLLECTION][DATASOURCE][ADDRESS])
        )
        data_source_pids_list._instance = [ds["pid"] for ds in data_sources]
    return data_source_pids_list._instance
