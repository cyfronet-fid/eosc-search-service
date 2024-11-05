import logging
from typing import List

import requests

from app.settings import settings

logger = logging.getLogger(__name__)
COL_UPLOAD_CONFIG = "col_upload_config"


def get_collection_names(solr_url: str = None) -> List[str]:
    """
    Get a list of existing Solr collections

    Args:
        solr_url (str): Solr address

    Returns:
        List[str]: A list of existing collection names
    """
    solr_url = solr_url or settings.SOLR_URL
    collections_url = f"{solr_url}solr/admin/collections?action=LIST"

    try:
        response = requests.get(collections_url)
        collections = response.json().get("collections", [])
        return collections

    except requests.RequestException as e:
        logging.error(f"Error getting Solr collections: Details: %s", e)
        raise


def get_pined_collections(solr_url: str = None) -> List[str]:
    """
    Get a list of existing Solr collections pinned to aliases

    Args:
        solr_url (str): Solr address

    Returns:
        List[str]: A list of existing collection names pinned to aliases
    """
    solr_url = solr_url or settings.SOLR_URL
    aliases_url = f"{solr_url}solr/admin/collections?action=LISTALIASES&wt=json"

    try:
        response = requests.get(aliases_url)
        collections_pined_list = list(response.json()["aliases"].values())
        return collections_pined_list

    except requests.RequestException as e:
        logging.error(
            "Error getting Solr collections pinned to aliases. Details: %s", e
        )
        raise


def get_solr_upload_config(prefix: str) -> dict:
    """Get solr upload configuration for a single data iteration.
    Meaning: data type -> collections to which this type will be sent."""
    return {
        settings.SOFTWARE: (prefix + "all_collection", prefix + "software"),
        settings.OTHER_RP: (prefix + "all_collection", prefix + "other_rp"),
        settings.DATASET: (prefix + "all_collection", prefix + "dataset"),
        settings.PUBLICATION: (prefix + "all_collection", prefix + "publication"),
        settings.ORGANISATION: (prefix + "organisation",),
        settings.PROJECT: (prefix + "project",),
        settings.SERVICE: (prefix + "all_collection", prefix + "service"),
        settings.DATASOURCE: (
            prefix + "all_collection",
            prefix + "service",
            prefix + "data_source",
        ),
        settings.BUNDLE: (prefix + "all_collection", prefix + "bundle"),
        settings.GUIDELINE: (prefix + "all_collection", prefix + "guideline"),
        settings.TRAINING: (prefix + "all_collection", prefix + "training"),
        settings.PROVIDER: (prefix + "provider",),
        settings.OFFER: (prefix + "offer",),
        settings.CATALOGUE: (prefix + "catalogue",),
    }


def get_uniq_solr_col_names(col_prefix: str) -> list[str]:
    """Get all unique collection names for a single data iteration given a collection prefix."""
    return [
        f"{col_prefix}{collection}" for collection in settings.SOLR_COLLECTION_NAMES
    ]
