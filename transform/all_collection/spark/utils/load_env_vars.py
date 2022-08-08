"""Retrieve .env variables"""
import os
from typing import Dict, Tuple
from dotenv import load_dotenv
from transform.all_collection.spark.utils.errors import DataPathsNotProvidedError

load_dotenv()

DATASET_PATH = "DATASET_PATH"
PUBLICATION_PATH = "PUBLICATION_PATH"
SOFTWARE_PATH = "SOFTWARE_PATH"
TRAININGS_PATH = "TRAININGS_PATH"
SERVICES_PATH = "SERVICES_PATH"
OUTPUT_PATH = "OUTPUT_PATH"
INPUT_FORMAT = "INPUT_FORMAT"
OUTPUT_FORMAT = "OUTPUT_FORMAT"

DATASETS = "DATASETS"
PUBLICATIONS = "PUBLICATIONS"
SOFTWARE = "SOFTWARE"
TRAININGS = "TRAININGS"
SERVICES = "SERVICES"


def load_env_vars() -> Tuple[Dict, Dict]:
    """Retrieve .env variables"""
    data_paths = {
        DATASET_PATH: os.environ.get(DATASET_PATH),
        PUBLICATION_PATH: os.environ.get(PUBLICATION_PATH),
        SOFTWARE_PATH: os.environ.get(SOFTWARE_PATH),
        TRAININGS_PATH: os.environ.get(TRAININGS_PATH),
    }

    if any((var is None for var in data_paths.values())):
        raise DataPathsNotProvidedError()

    data_paths[SERVICES_PATH] = os.environ.get(SERVICES_PATH)  # services are optional
    data_paths[OUTPUT_PATH] = os.environ.get(OUTPUT_PATH, "output")

    data_formats = {
        INPUT_FORMAT: os.environ.get(INPUT_FORMAT, "JSON"),
        OUTPUT_FORMAT: os.environ.get(OUTPUT_FORMAT, "JSON"),
    }

    return data_paths, data_formats
