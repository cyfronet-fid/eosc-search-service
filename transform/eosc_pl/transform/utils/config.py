"""Configuration"""

import os

from dotenv import load_dotenv

DATASET_ADDRESS = "DATASET_ADDRESS"
LICENSE_ADDRESS = "LICENSE_ADDRESS"
SOLR_URL = "SOLR_URL"
SOLR_EOSCPL_DATASET_COLS_NAME = "SOLR_EOSCPL_DATASET_COLS_NAME"

load_dotenv()


def get_config() -> dict:
    """Get configuration"""
    config = {
        DATASET_ADDRESS: os.environ.get(DATASET_ADDRESS),
        LICENSE_ADDRESS: os.environ.get(LICENSE_ADDRESS),
        SOLR_URL: os.environ.get(SOLR_URL, "http://149.156.182.2:8983"),
        SOLR_EOSCPL_DATASET_COLS_NAME: os.environ.get(SOLR_EOSCPL_DATASET_COLS_NAME),
    }

    return config
