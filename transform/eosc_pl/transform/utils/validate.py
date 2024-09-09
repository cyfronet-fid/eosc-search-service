# pylint: disable=invalid-name, logging-too-many-args
"""Validate loaded data"""
from logging import getLogger

import pandas as pd
from requests import Response

logger = getLogger(__name__)


def validate_loaded_pd_df(response: Response, df: pd.DataFrame) -> None:
    """Validate loaded pandas df"""
    try:
        # All data was returned
        assert (
            len(df) == response.json()["data"]["total_count"]
        ), "Not all resources were returned"
        # All resources are dataset type
        assert (df["type"] == "dataset").all(), "Not all resources are dataset type"
    except AssertionError as e:
        logger.error("An unexpected error occurred:", e)
