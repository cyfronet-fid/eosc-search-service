# pylint: disable=line-too-long
"""Load data"""
import os
from datetime import date
from dotenv import load_dotenv
from pyspark.sql import SparkSession
from transform.conf.s3 import connect_to_s3


DATASET = "DATASET"
PUBLICATION = "PUBLICATION"
SOFTWARE = "SOFTWARE"
OTHER_RP = "OTHER_RP"
TRAINING = "TRAINING"
SERVICE = "SERVICE"
DATASOURCE = "DATASOURCE"

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

SEND_TO_SOLR = "SEND_TO_SOLR"
SOLR_ADDRESS = "SOLR_ADDRESS"
SOLR_PORT = "SOLR_PORT"
SOLR_DATASET_COLS = "SOLR_DATASET_COLS"
SOLR_PUBLICATION_COLS = "SOLR_PUBLICATION_COLS"
SOLR_SOFTWARE_COLS = "SOLR_SOFTWARE_COLS"
SOLR_OTHER_RP_COLS = "SOLR_OTHER_RP_COLS"
SOLR_TRAINING_COLS = "SOLR_TRAINING_COLS"
SOLR_SERVICE_COLS = "SOLR_SERVICE_COLS"
SOLR_DATASOURCE_COLS = "SOLR_DATASOURCE_COLS"

SEND_TO_S3 = "SEND_TO_S3"
S3_ACCESS_KEY = "S3_ACCESS_KEY"
S3_SECRET_KEY = "S3_SECRET_KEY"
S3_ENDPOINT = "S3_ENDPOINT"
S3_BUCKET = "S3_BUCKET"
S3_CLIENT = "S3_CLIENT"
S3_DUMP_NAME = "S3_DUMP_NAME"

CREATE_LOCAL_DUMP = "CREATE_LOCAL_DUMP"
LOCAL_DUMP_PATH = "LOCAL_DUMP_PATH"

COLLECTIONS = "COLLECTIONS"
SOLR_COL_NAMES = "SOLR_COL_NAMES"
PATH = "PATH"
FIRST_FILE_PATH = "FIRST_FILE_PATH"
FIRST_FILE_DF = "FIRST_FILE_DF"

solr_col_mapping = {
    DATASOURCE: SOLR_DATASOURCE_COLS,
    SERVICE: SOLR_SERVICE_COLS,
    TRAINING: SOLR_TRAINING_COLS,
    OTHER_RP: SOLR_OTHER_RP_COLS,
    SOFTWARE: SOLR_SOFTWARE_COLS,
    PUBLICATION: SOLR_PUBLICATION_COLS,
    DATASET: SOLR_DATASET_COLS,
}
load_dotenv()


def load_data(
    spark: SparkSession, data_path: str, col_name: str, _format: str = "json"
):
    """Load data based on the provided data path"""
    if col_name in {SERVICE, DATASOURCE}:
        return spark.read.format(_format).option("multiline", True).load(data_path)
    return spark.read.format(_format).load(data_path)


def load_env_vars() -> dict:
    """Retrieve .env variables"""
    env_vars = {
        OUTPUT_PATH: os.environ.get(OUTPUT_PATH, "output/"),
        INPUT_FORMAT: os.environ.get(INPUT_FORMAT, "JSON"),
        OUTPUT_FORMAT: os.environ.get(OUTPUT_FORMAT, "JSON"),
        SEND_TO_SOLR: os.environ.get(SEND_TO_SOLR, True).lower() in ("true", "1", "t"),
        SEND_TO_S3: os.environ.get(SEND_TO_S3, False).lower() in ("true", "1", "t"),
        CREATE_LOCAL_DUMP: os.environ.get(CREATE_LOCAL_DUMP, False).lower()
        in ("true", "1", "t"),
    }

    if not (
        env_vars[SEND_TO_SOLR] or env_vars[SEND_TO_S3] or env_vars[CREATE_LOCAL_DUMP]
    ):
        raise ValueError(
            "Data needs to be send to SOLR or/and to S3. Otherwise, program will not have any effect"
        )

    load_config(env_vars)

    return env_vars


def load_config(env_vars: dict) -> None:
    """Load Solr config"""
    env_vars[COLLECTIONS] = create_collection(env_vars[SEND_TO_SOLR])
    current_date = str(date.today())

    if env_vars[SEND_TO_SOLR]:
        env_vars[SOLR_ADDRESS] = os.environ.get(SOLR_ADDRESS, "http://127.0.0.1")
        env_vars[SOLR_PORT] = os.environ.get(SOLR_PORT, 8983)

    if env_vars[SEND_TO_S3]:
        env_vars[S3_DUMP_NAME] = current_date
        for var in (S3_ACCESS_KEY, S3_SECRET_KEY, S3_ENDPOINT, S3_BUCKET):
            env_vars[var] = os.environ.get(var)
            assert env_vars[
                var
            ], f"Sending to S3 was enabled. Specify: {S3_ACCESS_KEY}, {S3_SECRET_KEY}, {S3_ENDPOINT}, {S3_BUCKET}"
        env_vars[S3_CLIENT] = connect_to_s3(
            env_vars[S3_ACCESS_KEY], env_vars[S3_SECRET_KEY], env_vars[S3_ENDPOINT]
        )

    if env_vars[CREATE_LOCAL_DUMP]:
        env_vars[LOCAL_DUMP_PATH] = os.environ.get(LOCAL_DUMP_PATH, current_date)


def create_collection(solr_flag: bool) -> dict:
    """Create collection"""
    collections = {
        DATASOURCE: {
            PATH: os.environ.get(DATASOURCE_PATH, "input_data/datasource/"),
            FIRST_FILE_PATH: None,
        },
        SERVICE: {
            PATH: os.environ.get(SERVICE_PATH, "input_data/service/"),
            FIRST_FILE_PATH: None,
        },
        TRAINING: {
            PATH: os.environ.get(TRAINING_PATH, "input_data/training/"),
            FIRST_FILE_PATH: None,
        },
        OTHER_RP: {
            PATH: os.environ.get(OTHER_RP_PATH, "input_data/other_rp/"),
            FIRST_FILE_PATH: None,
        },
        SOFTWARE: {
            PATH: os.environ.get(SOFTWARE_PATH, "input_data/software/"),
            FIRST_FILE_PATH: None,
        },
        DATASET: {
            PATH: os.environ.get(DATASET_PATH, "input_data/dataset/"),
            FIRST_FILE_PATH: None,
        },
        PUBLICATION: {
            PATH: os.environ.get(PUBLICATION_PATH, "input_data/publication/"),
            FIRST_FILE_PATH: None,
        },
    }
    if solr_flag:
        for col_name, col_val in collections.items():
            col_val[SOLR_COL_NAMES] = os.environ.get(solr_col_mapping[col_name])

    get_first_file_paths(collections)

    if any(
        (not bool(env_var) for col in collections.values() for env_var in col.values())
    ):
        raise ValueError(
            f"Not all necessary .env variables were passed. Env = {collections}"
        )

    return collections


def get_first_file_paths(collections: dict) -> None:
    """Get the first files from resource type directories.
    Used to check if the schema after transformations is appropriate for solr"""
    for col_name, col_props in collections.items():
        col_input_dir = col_props[PATH]
        collections[col_name][FIRST_FILE_PATH] = (
            col_input_dir + sorted(os.listdir(col_input_dir))[0]
        )
