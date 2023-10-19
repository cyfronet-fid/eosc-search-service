# pylint: disable=line-too-long, logging-fstring-interpolation
"""Retrieve data from the APIs of both the Marketplace and the Provider Component"""
from logging import getLogger
import requests
from app.transform.utils.loader import (
    load_env_vars,
    SERVICE,
    DATASOURCE,
    PROVIDER,
    OFFER,
    BUNDLE,
    MP_API_TOKEN,
)

logger = getLogger(__name__)


async def get_data(data_type: str, data_address: str) -> list[dict] | None:
    """Get data from the APIs of both MP and PC"""
    env_vars = load_env_vars()

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
