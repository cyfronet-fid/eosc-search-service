import logging
from typing import List

from app.services.solr.configsets import get_configset_names
from app.services.solr.collections import get_collection_names

logger = logging.getLogger(__name__)


def validate_configset_exists(configset: str) -> None:
    """
    Validates the existence of a Solr configset.

    Parameters:
        configset (str): The name of the Solr configset to be validated.

    Raises:
        ValueError: If the specified configset does not exist.
    """
    existing_configsets = get_configset_names()

    provider_configsets = [
        config for config in existing_configsets if config.endswith("_provider")
    ]
    non_provider_configsets = [
        config for config in existing_configsets if config not in provider_configsets
    ]

    config_type = "provider" if configset.endswith("_provider") else "all collection"
    target_configsets = (
        provider_configsets
        if configset.endswith("_provider")
        else non_provider_configsets
    )

    if len(target_configsets) == 0:
        error_msg = f"There is no {config_type=} configset. Please create one."
        logger.error(error_msg)
        raise ValueError(error_msg)

    if configset not in target_configsets:
        error_msg = (
            f"The specified {configset=} does not exist. "
            f"Please use on of the following {config_type=} configsets: {target_configsets}, "
            f"or create a new one"
        )
        logger.error(error_msg)
        raise ValueError(error_msg)


def validate_collections(
    collection_names: List[str], check_existence: bool = True
) -> None:
    """
    Validates the existence or non-existence of Solr collections.

    Parameters:
        collection_names (List[str]): A list of collection names to be validated.
        check_existence (bool): If True, check if collections exists. If False, check if collections don't exists.

    Raises:
        ValueError: If the specified collections do not exist (if check_existence is True)
            or if any of the specified collection already exist (if check_existence if False)
    """
    existing_collections = get_collection_names()

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
        raise ValueError(error_msg)
