# pylint: disable=line-too-long, invalid-name, logging-fstring-interpolation
"""Validate transformation"""
import logging
from itertools import zip_longest
from typing import KeysView, Literal

from pyspark.sql import DataFrame

logger = logging.getLogger(__name__)


def validate_schema(
    df: DataFrame,
    expected_schema: dict[str, list[str] | str],
    collection: str,
    source: Literal["input", "output"],
) -> None:
    """Check whether pyspark dataframe data schema is the same as expected"""
    # Assumption: schemas are sorted alphabetically
    df = df.select(*sorted(df.columns))  # Sort pyspark dataframe
    expected_schema = sort_dict_schemas(expected_schema)  # Sort expected schema

    validate_column_names(df.columns, expected_schema.keys(), collection, source)
    validate_column_types(df, expected_schema, collection, source)


def validate_column_names(
    actual_columns: list[str],
    expected_columns: KeysView[str],
    collection: str,
    source: Literal["input", "output"],
) -> None:
    """Validate that column names match"""
    cols_diff = set(actual_columns) ^ set(expected_columns)
    if cols_diff:
        logger.warning(
            f"{collection} - {source} schema validation failure. Column names mismatch. Difference: {cols_diff}"
        )


def validate_column_types(
    df: DataFrame,
    expected_schema: dict[str, list[str] | str],
    collection: str,
    source: Literal["input", "output"],
) -> None:
    """Validate that column types match"""
    actual_types = [column.dataType.simpleString() for column in df.schema.fields]
    differences = get_schema_differences(df.columns, actual_types, expected_schema)
    if differences:
        logger.warning(
            f"{collection} - {source} schema validation failure. Column types mismatch. Differences: {differences}"
        )


def validate_pd_schema(
    df: DataFrame,
    expected_schema: dict[str, list[str] | str],
    collection: str,
    source: Literal["input", "output"],
) -> None:
    """Validate Pandas schema"""
    # Assumption: schemas are sorted alphabetically
    df = df.reindex(sorted(df.columns), axis=1)  # Sort pandas df
    expected_schema = sort_dict_schemas(expected_schema)  # Sort expected schema

    validate_column_names(df.columns, expected_schema.keys(), collection, source)
    validate_pd_column_types(df, expected_schema, collection, source)


def validate_pd_column_types(
    df: DataFrame,
    expected_schema: dict[str, list[str] | str],
    collection: str,
    source: Literal["input", "output"],
) -> None:
    """Validate Pandas column types"""
    actual_schema = get_pd_df_schema(df)
    differences = get_schema_differences(
        list(actual_schema.keys()), list(actual_schema.values()), expected_schema
    )
    if differences:
        logger.warning(
            f"{collection} - {source} schema validation failure. Column types mismatch. Differences: {differences}"
        )


def get_pd_df_schema(df: DataFrame) -> dict:
    """Get Pandas data schema"""

    def get_column_type(column):
        for val in df[column]:
            if val is not None:
                return type(val).__name__
        return "NoneType"  # If all values are None

    return {col: get_column_type(col) for col in df.columns}


def is_type_match(actual_type: str, expected_type: list[str] | str) -> bool:
    """Check if the actual type matches the expected type(s)"""
    if isinstance(expected_type, list):
        return actual_type in expected_type or actual_type == "void"
    else:
        return actual_type == expected_type or actual_type == "void"


def get_schema_differences(
    columns: list[str],
    actual_schema: list[str],
    expected_schema: dict[str, list[str] | str],
) -> dict[str, dict[str, list[str] | str]]:
    """Print differences between schemas types"""
    differences = {}

    for col, actual_sch in zip_longest(columns, actual_schema):
        expected_sch = expected_schema[col]
        if not is_type_match(actual_sch, expected_sch):
            differences[col] = {"ACTUAL": actual_sch, "EXPECTED": expected_sch}
    return differences


def sort_dict_schemas(expected_schema: dict) -> dict:
    """Sort expected dict schema"""
    return {k: expected_schema[k] for k in sorted(expected_schema)}
