import os
from logging import getLogger
from typing import List

import pandas as pd
from tqdm import tqdm

from app.settings import settings
from app.transform.utils.json_io import read_json, write_json
from app.transform.utils.parquet_io import read_parquet, write_parquet
from app.transform.utils.utils import (
    create_file_path_column,
    drop_columns_pandas,
    group_relations,
)
from schemas.properties.data import (
    ADDITIONAL_COLUMNS,
    ID,
    LEGALNAME,
    RELATED_DATASET_IDS,
    RELATED_ORGANISATION_TITLES,
    RELATED_OTHER_IDS,
    RELATED_PROJECT_IDS,
    RELATED_PUBLICATION_IDS,
    RELATED_SOFTWARE_IDS,
)

logger = getLogger(__name__)

combined_pq = os.path.join(settings.TMP_DIRECTORY, "combined_data.parquet")
organisation_pq = os.path.join(settings.TMP_DIRECTORY, "organization.parquet")
project_pq = os.path.join(settings.TMP_DIRECTORY, "project.parquet")

# HELPER COLUMN NAMES
DIRECTORY = "directory"
FILE = "file"
SOURCE = "source"
SOURCE_FILE_PATH = "source_file_path"
SOURCE_TYPE = "source_type"
TARGET = "target"
TARGET_FILE_PATH = "target_file_path"
TARGET_TYPE = "target_type"


def load_information_for_directory(
    directory_path: str, selected_columns: List[str]
) -> pd.DataFrame:
    """
    Load information from a specified directory and return it as a DataFrame.

    Parameters:
        directory_path (str): Directory to load data from.
        selected_columns (List[str]): Columns to be selected from the data.

    Returns:
        pd.DataFrame: DataFrame containing data from the directory
    """
    dfs = []

    files = os.listdir(directory_path)
    directory_name = os.path.basename(directory_path.rstrip("/\\"))
    for file in tqdm(files, desc=f"Loading {directory_name} directory", unit="file"):
        if file.endswith(".json"):
            file_path = os.path.join(directory_path, file)
            json_data = read_json(file_path)
            df = pd.DataFrame(json_data)

            columns_to_use = (
                selected_columns + ADDITIONAL_COLUMNS
                if directory_path
                in settings.RELATIONS[settings.DIRECTORIES_WITH_ADDITIONAL_COLUMNS]
                else selected_columns
            )

            df = df[columns_to_use]

            df[DIRECTORY] = os.path.basename(directory_path.rstrip("/\\"))
            df[FILE] = file
            dfs.append(df)

    return pd.concat(dfs, ignore_index=True)


def process_single_directory(directory_path: str, selected_columns: List[str]) -> None:
    """
    Process a single directory and write its content as a Parquet file.

    Parameters:
        directory_path (str): Directory to process.
        selected_columns (List[str]): Columns to be selected from the data.
    """
    df = load_information_for_directory(directory_path, selected_columns)
    directory = os.path.basename(directory_path.rstrip("/\\"))
    write_parquet(
        df,
        os.path.join(settings.TMP_DIRECTORY, f"{directory}.parquet"),
    )


def process_combined_directories(
    data_directories: List[str], selected_columns: List[str]
) -> None:
    """
    Process multiple directories, combine them into single Parquet file if they are not in SINGLE_DIRECTORIES,
    if directory is ins SINGLE_DIRECTORIES then it is saved into separate Parquet file.

    Parameters:
        data_directories (List[str]): Directories to process.
        selected_columns (List[str]): Columns to be selected from the data.
    """
    combined_dfs = []

    for directory_path in tqdm(
        data_directories, desc="Processing Directories", unit="directory"
    ):
        if directory_path in settings.RELATIONS[settings.SINGLE_DIRECTORIES]:
            process_single_directory(directory_path, selected_columns)
        else:
            combined_dfs.append(
                load_information_for_directory(directory_path, selected_columns)
            )

    if combined_dfs:
        df_combined = pd.concat(combined_dfs, ignore_index=True)
        write_parquet(
            df_combined,
            combined_pq,
        )


def load_relations(relation_directories: List[str]) -> pd.DataFrame:
    """
    Load relation data from JSON files in the specified directories and return as a Pandas DataFrame.

    Parameters:
        relation_directories (List[str]): List of directories containing relation JSON files

    Returns:
        pd.DataFrame: DataFrame containing loaded relation data.
    """
    relations_list = []

    for directory_path in relation_directories:
        files = [f for f in os.listdir(directory_path) if f.endswith(".json")]
        for file in files:
            json_data = read_json(os.path.join(directory_path, file))

            if (
                directory_path
                in settings.RELATIONS[settings.RESULT_RELATION_DIRECTORIES]
            ):
                for entry in json_data:
                    entry[TARGET_TYPE] = (
                        os.path.basename(settings.ORGANISATION_PATH.rstrip("/\\"))
                        if directory_path == settings.RES_ORG_REL_PATH
                        else settings.PROJECT
                    )
            elif (
                directory_path
                in settings.RELATIONS[
                    settings.ORGANISATION_PROJECT_RELATION_DIRECTORIES
                ]
            ):
                for entry in json_data:
                    entry[TARGET_TYPE] = settings.PROJECT
                    entry[SOURCE_TYPE] = os.path.basename(
                        settings.ORGANISATION_PATH.rstrip("/\\")
                    )

            relations_list.extend(json_data)

    return pd.DataFrame(relations_list)


def update_json_file(
    file_path: str,
    df_group: pd.DataFrame,
    file_path_column: str,
    match_key: str,
    relation_type_key: str,
    relation_mappings: dict,
    data_key: str,
):
    """
    Update JSON file based on DataFrame group and relation mappings.

    Parameters:
        file_path (str): Path of the JSON file to update.
        df_group (pd.DataFrame): DataFrame containing grouped relation data.
        file_path_column (str): Column in which file_path is stored.
        match_key (str): The key to match in the JSON data.
        relation_type_key (str): The relation key to match relation_type.
        relation_mappings (dict): Dictionary mapping source types to relation types.
        data_key (str): The DataFrame column to use for updating the JSON entries.
    """
    json_data = read_json(file_path)

    for _, row in df_group[df_group[file_path_column] == file_path].iterrows():
        for entry in json_data:
            if entry[ID] == row[match_key]:
                for relation_type, relation_key in relation_mappings.items():
                    if row[relation_type_key] == relation_type:
                        entry[relation_key] = row[data_key]

    write_json(file_path, json_data)


def process_relations_generic(
    df_relations: pd.DataFrame,
    group_by_columns: List[str],
    agg_column: str,
    file_path_column: str,
    match_key: str,
    relation_type_key: str,
    relation_mappings: dict,
):
    """
    Generic processing of relations.
    """
    df_relations_group = group_relations(df_relations, group_by_columns, agg_column)
    unique_file_paths = set(df_relations_group[file_path_column])

    for file_path in tqdm(unique_file_paths, desc="Updating JSON Files", unit="file"):
        update_json_file(
            file_path,
            df_relations_group,
            file_path_column,
            match_key,
            relation_type_key,
            relation_mappings,
            agg_column,
        )


def process_result_relations() -> None:
    """
    Process result relations, merge with data, and update JSON files with related IDs.
    """
    result_data = read_parquet(combined_pq)
    df_relations = load_relations(
        settings.RELATIONS[settings.RESULT_RELATION_DIRECTORIES]
    )

    df_relations = pd.merge(
        df_relations,
        result_data,
        left_on=SOURCE,
        right_on=ID,
        how="left",
        suffixes=("_relations", "_result"),
    )

    df_relations[SOURCE_TYPE] = df_relations[DIRECTORY]
    drop_columns_pandas(df_relations, [ID, DIRECTORY, FILE])

    union_df = pd.concat(
        [
            read_parquet(project_pq),
            read_parquet(organisation_pq),
        ],
        ignore_index=True,
    )

    df_relations = pd.merge(
        df_relations,
        union_df,
        left_on=TARGET,
        right_on=ID,
        how="left",
        suffixes=("_relations", "_result"),
    )

    df_relations[TARGET_FILE_PATH] = create_file_path_column(
        df_relations, DIRECTORY, FILE
    )

    drop_columns_pandas(df_relations, [ID, DIRECTORY, FILE])

    relation_mappings = {
        settings.PUBLICATION: RELATED_PUBLICATION_IDS,
        settings.DATASET: RELATED_DATASET_IDS,
        os.path.basename(settings.OTHER_RP_PATH.rstrip("/\\")): RELATED_OTHER_IDS,
        settings.SOFTWARE: RELATED_SOFTWARE_IDS,
    }

    process_relations_generic(
        df_relations,
        [TARGET, TARGET_TYPE, SOURCE_TYPE, TARGET_FILE_PATH],
        SOURCE,
        TARGET_FILE_PATH,
        TARGET,
        SOURCE_TYPE,
        relation_mappings,
    )


def process_org_proj_rel() -> None:
    """
    Process organisation project relations and update JSON files with related IDs.
    """
    df_relations = load_relations(
        settings.RELATIONS[settings.ORGANISATION_PROJECT_RELATION_DIRECTORIES]
    )

    project_data = read_parquet(project_pq)

    df_relations = pd.merge(
        df_relations,
        project_data,
        left_on=TARGET,
        right_on=ID,
        how="left",
        suffixes=("_relations", "_result"),
    )

    df_relations[TARGET_FILE_PATH] = create_file_path_column(
        df_relations, DIRECTORY, FILE
    )

    drop_columns_pandas(df_relations, [ID, DIRECTORY, FILE])

    organisation_data = read_parquet(organisation_pq)

    df_relations = pd.merge(
        df_relations,
        organisation_data,
        left_on=SOURCE,
        right_on=ID,
        how="left",
        suffixes=("_relations", "_result"),
    )

    df_relations[SOURCE_FILE_PATH] = create_file_path_column(
        df_relations, DIRECTORY, FILE
    )

    drop_columns_pandas(df_relations, [ID, DIRECTORY, FILE])

    project_relation_mappings = {
        settings.PROJECT: RELATED_PROJECT_IDS,
    }

    process_relations_generic(
        df_relations,
        [SOURCE, TARGET_TYPE, SOURCE_FILE_PATH],
        TARGET,
        SOURCE_FILE_PATH,
        SOURCE,
        TARGET_TYPE,
        project_relation_mappings,
    )

    organisation_relation_mappings = {
        os.path.basename(
            settings.ORGANISATION_PATH.rstrip("/\\")
        ): RELATED_ORGANISATION_TITLES,
    }

    process_relations_generic(
        df_relations,
        [TARGET, SOURCE_TYPE, TARGET_FILE_PATH],
        LEGALNAME,
        TARGET_FILE_PATH,
        TARGET,
        SOURCE_TYPE,
        organisation_relation_mappings,
    )
