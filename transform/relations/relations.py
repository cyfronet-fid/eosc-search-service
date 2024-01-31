from tqdm import tqdm
from relations.process_data import (
    process_combined_directories,
    process_organization_project_relations,
    process_result_relations,
)
from schemas.properties.data import SELECTED_COLUMNS, DATA_DIRECTORIES
from utils.delete import clean_tmp


def process_relations():
    """
    This function serves as a central point for executing a series of data processing steps.
    It handles the conversion of JSON data into Parquet files, optimizes data storage,
    and manages the relationships between different data entities. The function performs
    the following key tasks:

    1. Processes multiple data directories: Combines data from specified directories into
       Parquet files. If a directory is part of SINGLE_DIRECTORIES, its content is saved
       into a separate Parquet file. Otherwise, data from multiple directories are
       combined into a single Parquet file.

    2. Processes result relations: Analyzes and processes the relationships found in the
       result data, updating the JSON files with related identifiers.

    3. Processes organization-project relations: Handles the specific relations between
       organizations and projects, updating JSON files as required.

    4. Cleans up temporary files: After processing, it clears out all files in the
       temporary directory to free up space and keep the workspace tidy.

    The data directories to be processed, along with the columns to be selected for each,
    are specified by the DATA_DIRECTORIES and SELECTED_COLUMNS variables, respectively.
    """
    tasks = [
        (
            "Processing information about relationships into Parquet files",
            process_combined_directories,
            DATA_DIRECTORIES,
            SELECTED_COLUMNS,
        ),
        ("Processing result relations", process_result_relations),
        (
            "Processing organization-project relations",
            process_organization_project_relations,
        ),
        ("Cleaning up temporary files", clean_tmp),
    ]

    for desc, func, *args in tqdm(tasks, desc="Processing relations", unit="step"):
        tqdm.write(desc)
        func(*args)
