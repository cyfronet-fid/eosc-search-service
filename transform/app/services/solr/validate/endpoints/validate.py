# pylint: disable=line-too-long, invalid-name, logging-fstring-interpolation
"""Validate Solr"""

import logging
from typing import List

import requests
from fastapi import HTTPException
from requests import RequestException
from requests.exceptions import ConnectionError as ReqConnectionError

from app.services.solr.collections import get_collection_names, get_pined_collections
from app.services.solr.configs import get_config_names
from app.services.solr.utils import ids_mapping
from app.services.solr.validate.schema.validate import logger
from app.settings import settings

logger = logging.getLogger(__name__)


def check_document_exists(
    col_name: str,
    data_id: str,
) -> bool:
    """
    Check if a Solr document exists in all specified collections based on its ID.

    Args:
        col_name (str): Name of the collection to check within.
        data_id (str): ID of the data/document to be checked.

    Returns:
        bool: True if document exists in any of the specified collections, False otherwise.
    """
    solr_col_names = settings.COLLECTIONS[col_name]["SOLR_COL_NAMES"]
    check_if_exists = []
    id_increment = ids_mapping(data_id, col_name)

    for s_col_name in solr_col_names:
        url = f"{settings.SOLR_URL}solr/{s_col_name}/select?q=id:{id_increment}"
        try:
            req = requests.get(url, timeout=180)
            if req.status_code == 200:
                response_data = req.json()
                if response_data["response"]["numFound"] > 0:
                    check_if_exists.append(True)
                    logger.info(
                        f"Document ID={id_increment} found in solr_col={s_col_name} (data type: {col_name})."
                    )
                else:
                    check_if_exists.append(False)
                    logger.info(
                        f"No document ID={id_increment} found in solr_col={s_col_name} (data type: {col_name})."
                    )
            else:
                check_if_exists.append(False)
                logger.error(
                    f"Failed to query Solr ({url=}). Status: {req.status_code}."
                    f"Data type: {col_name}, Solr collection: {s_col_name}, ID: {id_increment}"
                )
        except ReqConnectionError as e:
            check_if_exists.append(False)
            logger.error(
                f"Connection failed, {url=}."
                f"Data type: {col_name}, Solr collection: {s_col_name}. Details: {e}"
            )

    return any(check_if_exists)


def validate_configset_exists(configset: str) -> None:
    """
    Validates the existence of a Solr configset.

    Parameters:
        configset (str): The name of the Solr configset to be validated.

    Raises:
        HTTPException: If there is an internal server error while getting Solr config sets or if the specified configset
            does not exist (HTTP 500 for internal server error, HTTP 400 for missing configset).
    """
    try:
        existing_configs = get_config_names()
    except RequestException as e:
        error_msg = f"Internal server error while getting Solr config sets for validation. Details: {str(e)}"
        logging.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

    provider_configs = [
        config for config in existing_configs if config.endswith("_provider")
    ]
    non_provider_configs = [
        config for config in existing_configs if config not in provider_configs
    ]

    config_type = "provider" if configset.endswith("_provider") else "all collection"
    target_configs = (
        provider_configs if configset.endswith("_provider") else non_provider_configs
    )

    if len(target_configs) == 0:
        error_msg = f"There is no {config_type=} configset. Please create one."
        logger.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)

    if configset not in target_configs:
        error_msg = (
            f"The specified {configset=} does not exist. "
            f"Please use on of the following {config_type=} config sets: {target_configs}, "
            f"or create a new one"
        )
        logger.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)


def validate_collections(
    collection_names: List[str], check_existence: bool = True
) -> None:
    """
    Validates the existence or non-existence of Solr collections.

    Parameters:
        collection_names (List[str]): A list of collection names to be validated.
        check_existence (bool): If True, check if collections exists. If False, check if collections don't exist.

    Raises:
        HTTPException: If there is an internal server error while getting Solr collections or if the specified
            collections do not exist (HTTP 500 for internal server error, HTTP 400 for missing collections).
    """
    try:
        existing_collections = get_collection_names()
    except RequestException as e:
        error_msg = f"Internal server error while getting Solr collections for validation. Details: {str(e)}"
        logging.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

    invalid_collections = [
        collection
        for collection in collection_names
        if (collection in existing_collections) == check_existence
    ]

    if invalid_collections:
        error_msg = (
            f"Some collections in this iteration "
            f"{'already exist' if check_existence else 'do not exist'}: {invalid_collections=}"
        )
        logger.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)


def validate_pinned_collections(
    collection_names: List[str],
) -> None:
    """
    Validate whether Solr collection are pinned to aliases.

    Parameters:
        collection_names (List[str]): A list of Solr collection names to be validated.

    Raises:
        HTTPException: If there is an internal server error while getting Solr collections pinned to aliases
            or if the specified collections are still pinned to aliases (HTTP 500 for internal server error,
            HTTP 400 for collections still pinned).
    """
    try:
        pinned_collections = get_pined_collections()
    except RequestException as e:
        error_msg = (
            f"Internal server error while getting Solr collections pinned to aliases for validation. "
            f"Details: {str(e)}"
        )
        logging.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

    still_pinned_collections = [
        collection
        for collection in collection_names
        if collection in pinned_collections
    ]

    if still_pinned_collections:
        error_msg = f"Some collections in this iteration are still pinned to aliases, {still_pinned_collections=}"
        logger.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)


def validate(
    all_collection_config: str,
    catalogue_config: str,
    organisation_config: str,
    project_config: str,
    provider_config: str,
    collection_names: list[str],
) -> None:
    """Main validation function."""
    logger.info("Validating creation of solr collections...")
    try:
        validate_configset_exists(all_collection_config)
        validate_configset_exists(catalogue_config)
        validate_configset_exists(organisation_config)
        validate_configset_exists(project_config)
        validate_configset_exists(provider_config)
        validate_collections(collection_names, check_existence=True)

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    except HTTPException as he:
        raise HTTPException(status_code=he.status_code, detail=str(he.detail))
