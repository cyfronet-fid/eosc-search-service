"""Configuration"""

import os
from dotenv import load_dotenv

DATASET_ADDRESS = "DATASET_ADDRESS"
SOLR_URL = "SOLR_URL"
SOLR_EOSCPL_DATASET_COL_NAME = "SOLR_EOSCPL_DATASET_COL_NAME"

load_dotenv()


def get_config() -> dict:
    """Get configuration"""
    config = {
        DATASET_ADDRESS: os.environ.get(DATASET_ADDRESS),
        SOLR_URL: os.environ.get(SOLR_URL, "http://149.156.182.2:8983"),
        SOLR_EOSCPL_DATASET_COL_NAME: os.environ.get(SOLR_EOSCPL_DATASET_COL_NAME),
    }

    return config
