"""Configuration"""
import os
from dotenv import load_dotenv

DATASET_ADDRESS = "DATASET_ADDRESS"
SOLR_ADDRESS = "SOLR_ADDRESS"
SOLR_COL_NAME = "SOLR_COL_NAME"

load_dotenv()


def get_config() -> dict:
    """Get configuration"""
    config = {
        DATASET_ADDRESS: os.environ.get(DATASET_ADDRESS),
        SOLR_ADDRESS: os.environ.get(SOLR_ADDRESS, "http://149.156.182.2:8983"),
        SOLR_COL_NAME: os.environ.get(SOLR_COL_NAME),
    }

    return config
