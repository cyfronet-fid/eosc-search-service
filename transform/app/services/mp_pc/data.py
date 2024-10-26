# pylint: disable=line-too-long, logging-fstring-interpolation
"""Retrieve data from the APIs of both the Marketplace and the Provider Component"""
import asyncio
from logging import getLogger

import requests

from app.settings import settings

logger = getLogger(__name__)


async def get_data(data_type: str, data_address: str) -> list[dict] | None:
    """Get data from the APIs of both MP and PC"""
    try:
        if data_type in (
            settings.SERVICE,
            settings.DATASOURCE,
            settings.PROVIDER,
            settings.OFFER,
            settings.BUNDLE,
            settings.CATALOGUE,
        ):
            headers = {
                "accept": "application/json",
                "X-User-Token": settings.MP_API_TOKEN,
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


def get_data_source_pids() -> list[str]:
    # TODO add reset pids after full oag transform
    """
    Returns a list of data source PIDs (used for OAG resources), using a singleton pattern.

    Assumptions:
    - Get data sources pids only once at the beginning of data upload iteration (constant through whole update).
    - Reset data source pids property after completed data update (next upload should get new ones).

    Returns:
        list[str]: A list of data source PIDs.
    """
    if (
        not hasattr(get_data_source_pids, "_instance")
        or get_data_source_pids._instance is None
    ):
        data_sources = (
            asyncio.run(
                get_data(
                    settings.DATASOURCE,
                    settings.COLLECTIONS[settings.DATASOURCE]["ADDRESS"],
                )
            )
            or []
        )
        get_data_source_pids._instance = (
            [ds["pid"] for ds in data_sources] if data_sources else []
        )

    return get_data_source_pids._instance


def get_providers_mapping() -> dict[str, str] | dict:
    """Get providers mapping dict, that maps pids into names."""
    providers_raw = asyncio.run(
        get_data(settings.PROVIDER, settings.COLLECTIONS[settings.PROVIDER]["ADDRESS"])
    )

    if providers_raw:
        return {provider["pid"]: provider["name"] for provider in providers_raw}

    logger.error(
        f"Failed to retrieve providers from {settings.COLLECTIONS[settings.PROVIDER]['ADDRESS']}."
    )
    return {}
