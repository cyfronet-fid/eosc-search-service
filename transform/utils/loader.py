# pylint: disable=line-too-long, wildcard-import
"""Load data"""
import os
import json
from datetime import date
from dotenv import load_dotenv
from pyspark.sql import SparkSession
from conf.s3 import connect_to_s3
from schemas.output import *
from schemas.properties.env import *

solr_all_col_mapping = {
    SERVICE: SOLR_SERVICE_COLS,
    DATASOURCE: SOLR_DATASOURCE_COLS,
    GUIDELINE: SOLR_GUIDELINE_COLS,
    OFFER: SOLR_OFFER_COLS,
    BUNDLE: SOLR_BUNDLE_COLS,
    TRAINING: SOLR_TRAINING_COLS,
    OTHER_RP: SOLR_OTHER_RP_COLS,
    SOFTWARE: SOLR_SOFTWARE_COLS,
    DATASET: SOLR_DATASET_COLS,
    PUBLICATION: SOLR_PUBLICATION_COLS,
}

solr_sep_col_mapping = {
    PROVIDER: SOLR_PROVIDER_COLS,
}

load_dotenv()


def load_data(
    spark: SparkSession, data_path: str, col_name: str, _format: str = "json"
):
    """Load data based on the provided data path"""
    if col_name in {SERVICE, DATASOURCE, PROVIDER, BUNDLE, OFFER}:
        return spark.read.format(_format).option("multiline", True).load(data_path)
    if col_name == TRAINING:
        return spark.read.json(spark.sparkContext.parallelize([json.dumps(data_path)]))
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
    env_vars[ALL_COLLECTION] = load_vars_all_collection(env_vars[SEND_TO_SOLR])
    env_vars[SEPARATE_COLLECTION] = load_vars_sep_collection(env_vars[SEND_TO_SOLR])
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


def load_vars_all_collection(solr_flag: bool) -> dict:
    """Load variables for all collection"""
    collections = {
        SOFTWARE: {
            PATH: os.environ.get(SOFTWARE_PATH, "input_data/software/"),
            OUTPUT_SCHEMA: software_output_schema,
        },
        PUBLICATION: {
            PATH: os.environ.get(PUBLICATION_PATH, "input_data/publication/"),
            OUTPUT_SCHEMA: publication_output_schema,
        },
        DATASET: {
            PATH: os.environ.get(DATASET_PATH, "input_data/dataset/"),
            OUTPUT_SCHEMA: dataset_output_schema,
        },
        OTHER_RP: {
            PATH: os.environ.get(OTHER_RP_PATH, "input_data/other_rp/"),
            OUTPUT_SCHEMA: other_rp_output_schema,
        },
        SERVICE: {
            PATH: os.environ.get(SERVICE_PATH, "input_data/service/"),
            OUTPUT_SCHEMA: service_output_schema,
        },
        DATASOURCE: {
            PATH: os.environ.get(DATASOURCE_PATH, "input_data/datasource/"),
            OUTPUT_SCHEMA: data_source_output_schema,
        },
        OFFER: {
            PATH: os.environ.get(OFFER_PATH, "input_data/offer/"),
            OUTPUT_SCHEMA: offer_output_schema,
        },
        BUNDLE: {
            PATH: os.environ.get(BUNDLE_PATH, "input_data/bundle/"),
            OUTPUT_SCHEMA: bundle_output_schema,
        },
        GUIDELINE: {
            ADDRESS: os.environ.get(
                GUIDELINE_ADDRESS,
                "https://beta.providers.eosc-portal.eu/api/interoperabilityRecord/all",
            ),
            OUTPUT_SCHEMA: guideline_output_schema,
        },
        TRAINING: {
            ADDRESS: os.environ.get(
                TRAINING_ADDRESS,
                "https://providers.eosc-portal.eu/api/trainingResource/all?catalogue_id=all&quantity=10000",
            ),
            OUTPUT_SCHEMA: training_output_schema,
        },
    }
    if solr_flag:
        load_solr_cols_name(collections, solr_all_col_mapping)

    return collections


def load_vars_sep_collection(solr_flag: bool) -> dict:
    """Load variables for separate collections"""
    sep_collections = {
        PROVIDER: {
            PATH: os.environ.get(PROVIDER_PATH, "input_data/provider/"),
            OUTPUT_SCHEMA: provider_output_schema,
        }
    }
    if solr_flag:
        load_solr_cols_name(sep_collections, solr_sep_col_mapping)

    return sep_collections


def load_solr_cols_name(collections: dict, solr_mapping: dict) -> None:
    """Load solr collections name"""
    for col_name, col_val in collections.items():
        col_val[SOLR_COL_NAMES] = os.environ.get(solr_mapping[col_name])

    if any(
        (not bool(env_var) for col in collections.values() for env_var in col.values())
    ):
        raise ValueError(
            f"Not all necessary .env variables were passed. Env = {collections}"
        )
