"""Module for helper utilities for solr operations module"""
import asyncio
import logging
from typing import Callable, Optional

from httpx import AsyncClient

from app.settings import settings

logger = logging.getLogger(__name__)


async def _get_provider_data_guideline(client: AsyncClient, doc: dict) -> dict:
    """Extracts provider pid from single guideline document and injects a new value into response
    If the value can't be got (if the pid of provider is missing or faulty), empty value is set.
    """
    title = ""
    provider_pid = doc.get("provider")
    if provider_pid:
        title = await _get_provider_name(
            client=client, doc=doc, provider_pid=provider_pid
        )
    doc["provider_name"] = title or ""
    return doc


async def _get_provider_data_training(client: AsyncClient, doc: dict) -> dict:
    """Extracts provider and resource_organisation pid from single training document
    and injects a new values into response.
    If the value can't be got (if the pids of providers or resource_organisation
    is missing or faulty), empty values are set.
    """
    provider_pids = doc.get("eosc_provider")
    resource_organisation_pid = doc.get("resource_organisation")
    titles = []
    rs_title = ""
    if resource_organisation_pid:
        rs_title = await _get_provider_name(
            client=client, doc=doc, provider_pid=resource_organisation_pid
        )

    if provider_pids:
        for provider_pid in provider_pids:
            title = await _get_provider_name(
                client=client, doc=doc, provider_pid=provider_pid
            )
            if title:
                titles.append(title)
    doc["providers_names"] = titles
    doc["resource_organisation_name"] = rs_title or ""
    return doc


# pylint: disable=logging-fstring-interpolation,
async def _get_provider_name(
    client: AsyncClient, doc: dict, provider_pid: str
) -> Optional[str]:
    """Returns the title of a given provider (human-readable name)"""
    url = f"{settings.SOLR_URL}{settings.COLLECTIONS_PREFIX}provider/query?q=pid:{provider_pid}"
    response = await client.get(url)
    try:
        return response.json()["response"]["docs"][0]["title"][0]
    except IndexError:
        logger.warning(f"Provider {provider_pid} for document {doc['id']} not found")
        return None


TYPE_TO_FUNCTION_MAP: {str, Callable} = {
    "interoperability guideline": _get_provider_data_guideline,
    "training": _get_provider_data_training,
}


async def map_list_providers(client: AsyncClient, docs: list) -> list:
    """Main function responsible for getting provider's human-readable name
    for training or IG list request.
    Calls detail request function for each document from the list and returns a
    gathered result
    """

    # noinspection PyTypeChecker
    return await asyncio.gather(
        *[map_detail_provider(client=client, doc=doc) for doc in docs]
    )


async def map_detail_provider(client: AsyncClient, doc: dict) -> dict:
    """Main function responsible for getting provider's human-readable name
    for training or IG detail request.
    In respect to the resource type calls an appropriate function to get
    requested data.
    """

    resource_type = doc["type"]
    if resource_type in ["interoperability guideline", "training"]:
        await TYPE_TO_FUNCTION_MAP[resource_type](client, doc)
    return doc
