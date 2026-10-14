"""
Helper module to inject related services data into
interoperability guidelines response
"""

import asyncio
import logging
from typing import Optional

from fastapi import HTTPException
from httpx import (
    AsyncClient,
    ConnectError,
    ConnectTimeout,
    HTTPError,
    HTTPStatusError,
)

from app.consts import ResourceType
from app.error_handling.exceptions import RelatedServicesError
from app.schemas.solr_response import Collection, RelatedService
from app.settings import settings
from app.solr.error_handling import handle_solr_list_response_errors
from app.solr.utils import first_solr_value

logger = logging.getLogger(__name__)


def _parse_categories(
    categories: list, unified_categories: Optional[list]
) -> list:
    categories_set = set()
    for item in categories:
        try:
            categories_set.add(item.split(">")[1])
        except IndexError:
            pass
    if unified_categories:
        return list(categories_set.union(unified_categories))
    return list(categories_set)


async def _get_related_records_pids(
    client: AsyncClient, ig_pid: str
) -> list[str]:
    try:
        response = await client.get(
            f"{settings.RELATED_SERVICES_ENDPOINT}/{ig_pid}"
        )
        response.raise_for_status()

        try:
            json_data = response.json()
        except ValueError as exc:
            logger.error(
                "Error parsing JSON response from Provider Component's"
                " API for guideline %s. "
                "Response content: %s",
                ig_pid,
                response.text,
            )
            raise RelatedServicesError(
                detail="Invalid JSON received from the related services API."
            ) from exc

        return json_data or []

    except (ConnectError, ConnectTimeout) as conn_err:
        logger.error(
            "Connection error while fetching related services "
            "for guideline %s: %s",
            ig_pid,
            conn_err,
        )
        raise RelatedServicesError(detail="Connection error") from conn_err

    except HTTPStatusError as http_err:
        logger.error(
            "HTTP error while fetching related services for guideline %s: %s",
            ig_pid,
            http_err,
        )
        raise RelatedServicesError(
            status_code=http_err.response.status_code,
            detail=(
                f"Server error for related services for guideline {ig_pid}: "
                f"{http_err.response.text}"
            ),
        ) from http_err

    except HTTPError as exc:
        logger.error(
            "HTTP transport error while fetching related services "
            "for guideline %s: %s",
            ig_pid,
            exc,
        )
        raise RelatedServicesError(detail="HTTP transport error") from exc


async def _fetch_services_from_solr(
    client: AsyncClient,
    pids: list[str],
) -> dict[str, RelatedService]:
    """Fetch related services from Solr in batch queries instead of one by one."""
    unique_pids = list(dict.fromkeys(pids))
    if not unique_pids:
        return {}

    solr_collection = (
        f"{settings.COLLECTIONS_PREFIX}{Collection.ALL_COLLECTION}"
    )
    url = f"{settings.SOLR_URL}{solr_collection}/select"
    services: dict[str, RelatedService] = {}
    chunk_size = 200

    for i in range(0, len(unique_pids), chunk_size):
        chunk = unique_pids[i : i + chunk_size]
        request_body = {
            "params": {
                "q": "*:*",
                "fq": [f"{{!terms f=pid}}{','.join(chunk)}"],
                "fl": "pid,best_access_right,title,resource_organisation,type",
                "rows": len(chunk),
                "wt": "json",
            }
        }
        try:
            response = await handle_solr_list_response_errors(
                client.post(url, json=request_body)
            )
            docs = response.json().get("response", {}).get("docs", [])
            for doc in docs:
                pid_val = first_solr_value(doc.get("pid"))
                if pid_val:
                    services[pid_val] = RelatedService(
                        pid=pid_val,
                        best_access_right=first_solr_value(
                            doc.get("best_access_right")
                        ),
                        title=first_solr_value(doc.get("title")),
                        resource_organisation=first_solr_value(
                            doc.get("resource_organisation")
                        ),
                        type=first_solr_value(doc.get("type")),
                    )
        except (HTTPException, HTTPError, ValueError) as exc:
            logger.exception(
                "Error during Solr batch fetch for %d PIDs: %s",
                len(chunk),
                exc,
            )

    return services


async def _get_related_services(
    client: AsyncClient,
    related_services_pids: list[str],
) -> list[RelatedService]:
    """Helper to resolve a list of PIDs to RelatedService objects."""
    unique_pids = list(dict.fromkeys(related_services_pids))
    if not unique_pids:
        return []
    services_map = await _fetch_services_from_solr(client, unique_pids)
    return [services_map[pid] for pid in unique_pids if pid in services_map]


async def _get_related_service(
    client: AsyncClient, pid: str
) -> Optional[RelatedService]:
    """Helper to fetch a single service by PID."""
    services_map = await _fetch_services_from_solr(client, [pid])
    return services_map.get(pid)


async def extend_ig_with_related_services(
    client: AsyncClient, docs: list[dict]
) -> list[dict]:
    """Main function responsible for extending interoperability
    guideline response with related services data
    """
    guideline_docs = [
        doc for doc in docs if doc.get("type") == ResourceType.GUIDELINE
    ]

    if not guideline_docs:
        return docs

    async def _safe_get_pids(doc: dict) -> tuple[dict, list[str]]:
        doc_id = doc.get("id")
        try:
            pids = await _get_related_records_pids(client, doc_id)
            return doc, pids
        except RelatedServicesError:
            logger.exception(
                "Exception happened during _get_related_records_pids for guideline %s",
                doc_id,
            )
            return doc, []

    doc_pids_pairs: list[tuple[dict, list[str]]] = await asyncio.gather(
        *[_safe_get_pids(doc) for doc in guideline_docs]
    )

    all_pids = list(
        dict.fromkeys(pid for _, pids in doc_pids_pairs for pid in pids if pid)
    )

    services_by_pid: dict[str, RelatedService] = {}
    if all_pids:
        services_by_pid = await _fetch_services_from_solr(client, all_pids)

    for doc, pids in doc_pids_pairs:
        unique_pids = list(dict.fromkeys(pids))
        doc["related_services"] = [
            services_by_pid[pid]
            for pid in unique_pids
            if pid in services_by_pid
        ]

    return docs
