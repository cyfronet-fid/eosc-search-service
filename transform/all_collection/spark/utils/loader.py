# pylint: disable=line-too-long
"""Load data"""
import os
from typing import Dict
from dotenv import load_dotenv
from pyspark.sql import SparkSession


__all__ = [
    "DATASET_PATH",
    "PUBLICATION_PATH",
    "SOFTWARE_PATH",
    "OTHER_RP_PATH",
    "TRAINING_PATH",
    "SERVICE_PATH",
    "DATASOURCE_PATH",
    "OUTPUT_PATH",
    "INPUT_FORMAT",
    "OUTPUT_FORMAT",
    "SOLR_ADDRESS",
    "SOLR_PORT",
    "SOLR_DATASET_COLS",
    "SOLR_PUBLICATION_COLS",
    "SOLR_SOFTWARE_COLS",
    "SOLR_OTHER_RP_COLS",
    "SOLR_TRAINING_COLS",
    "SOLR_SERVICE_COLS",
    "SOLR_DATASOURCE_COLS",
    "DATASET",
    "PUBLICATION",
    "SOFTWARE",
    "OTHER_RP",
    "TRAINING",
    "SERVICE",
    "DATASOURCE",
    "COLLECTIONS",
    "NAMES",
    "PATH",
    "FIRST_FILE_PATH",
    "FIRST_FILE_DF",
    "load_data",
    "load_env_vars",
]

DATASET_PATH = "DATASET_PATH"
PUBLICATION_PATH = "PUBLICATION_PATH"
SOFTWARE_PATH = "SOFTWARE_PATH"
OTHER_RP_PATH = "OTHER_RP_PATH"
TRAINING_PATH = "TRAINING_PATH"
SERVICE_PATH = "SERVICE_PATH"
DATASOURCE_PATH = "DATASOURCE_PATH"
OUTPUT_PATH = "OUTPUT_PATH"

INPUT_FORMAT = "INPUT_FORMAT"
OUTPUT_FORMAT = "OUTPUT_FORMAT"

SOLR_ADDRESS = "SOLR_ADDRESS"
SOLR_PORT = "SOLR_PORT"
SOLR_DATASET_COLS = "SOLR_DATASET_COLS"
SOLR_PUBLICATION_COLS = "SOLR_PUBLICATION_COLS"
SOLR_SOFTWARE_COLS = "SOLR_SOFTWARE_COLS"
SOLR_OTHER_RP_COLS = "SOLR_OTHER_RP_COLS"
SOLR_TRAINING_COLS = "SOLR_TRAINING_COLS"
SOLR_SERVICE_COLS = "SOLR_SERVICE_COLS"
SOLR_DATASOURCE_COLS = "SOLR_DATASOURCE_COLS"

DATASET = "DATASET"
PUBLICATION = "PUBLICATION"
SOFTWARE = "SOFTWARE"
OTHER_RP = "OTHER_RP"
TRAINING = "TRAINING"
SERVICE = "SERVICE"
DATASOURCE = "DATASOURCE"

COLLECTIONS = "COLLECTIONS"
NAMES = "NAMES"
PATH = "PATH"
FIRST_FILE_PATH = "FIRST_FILE_PATH"
FIRST_FILE_DF = "FIRST_FILE_DF"


load_dotenv()


def load_data(
    spark: SparkSession, data_path: str, col_name: str, _format: str = "json"
):
    """Load data based on the provided data path"""
    if col_name in {SERVICE, DATASOURCE}:
        return spark.read.format(_format).option("multiline", True).load(data_path)
    return spark.read.format(_format).load(data_path)


def load_env_vars() -> Dict:
    """Retrieve .env variables"""
    collections = {
        DATASOURCE: {
            NAMES: os.environ.get(SOLR_DATASOURCE_COLS),
            PATH: os.environ.get(DATASOURCE_PATH, "input_data/datasource/"),
            FIRST_FILE_PATH: None,
        },
        SERVICE: {
            NAMES: os.environ.get(SOLR_SERVICE_COLS),
            PATH: os.environ.get(SERVICE_PATH, "input_data/service/"),
            FIRST_FILE_PATH: None,
        },
        TRAINING: {
            NAMES: os.environ.get(SOLR_TRAINING_COLS),
            PATH: os.environ.get(TRAINING_PATH, "input_data/training/"),
            FIRST_FILE_PATH: None,
        },
        OTHER_RP: {
            NAMES: os.environ.get(SOLR_OTHER_RP_COLS),
            PATH: os.environ.get(OTHER_RP_PATH, "input_data/other_rp/"),
            FIRST_FILE_PATH: None,
        },
        SOFTWARE: {
            NAMES: os.environ.get(SOLR_SOFTWARE_COLS),
            PATH: os.environ.get(SOFTWARE_PATH, "input_data/software/"),
            FIRST_FILE_PATH: None,
        },
        PUBLICATION: {
            NAMES: os.environ.get(SOLR_PUBLICATION_COLS),
            PATH: os.environ.get(PUBLICATION_PATH, "input_data/publication/"),
            FIRST_FILE_PATH: None,
        },
        DATASET: {
            NAMES: os.environ.get(SOLR_DATASET_COLS),
            PATH: os.environ.get(DATASET_PATH, "input_data/dataset/"),
            FIRST_FILE_PATH: None,
        },
    }
    get_first_file_paths(collections)

    if any(
        (not bool(env_var) for col in collections.values() for env_var in col.values())
    ):
        raise ValueError(
            f"Not all necessary .env variables (paths, solr collection names) were passed. Data env = {collections}"
        )

    env_vars = {
        COLLECTIONS: collections,
        OUTPUT_PATH: os.environ.get(OUTPUT_PATH, "output"),
        INPUT_FORMAT: os.environ.get(INPUT_FORMAT, "JSON"),
        OUTPUT_FORMAT: os.environ.get(OUTPUT_FORMAT, "JSON"),
        SOLR_ADDRESS: os.environ.get(SOLR_ADDRESS, "http://127.0.0.1"),
        SOLR_PORT: os.environ.get(SOLR_PORT, 8983),
    }

    return env_vars


def get_first_file_paths(collections: Dict) -> None:
    """Get the first files from resource type directories.
    Used to check if the schema after transformations is appropriate for solr"""
    for col_name, col_props in collections.items():
        col_input_dir = col_props[PATH]
        collections[col_name][FIRST_FILE_PATH] = (
            col_input_dir + sorted(os.listdir(col_input_dir))[0]
        )
