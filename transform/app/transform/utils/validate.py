# pylint: disable=line-too-long, invalid-name, logging-fstring-interpolation
"""Validate transformation"""
import logging
from itertools import zip_longest
from pyspark.sql import DataFrame
from typing import Literal

logger = logging.getLogger(__name__)


def validate_schema(
    df: DataFrame,
    expected_schema: dict,
    collection: str,
    source: Literal["input", "output"],
) -> None:
    """Check whether pyspark dataframe data schema is the same as expected"""
    # Assumption: schemas are sorted alphabetically
    df = df.select(*sorted(df.columns))  # Sort pyspark dataframe
    expected_schema = sort_dict_schemas(expected_schema)  # Sort expected schema

    columns = df.columns
    schemas = [column.dataType.simpleString() for column in df.schema.fields]

    # All columns name are the same
    cols_diff = set(columns) ^ set(expected_schema.keys())
    assert len(cols_diff) == 0, logger.warning(
        f"{collection} - {source} schema validation failure. Column names mismatch. Difference: {cols_diff}"
    )

    # All schemas for the same columns are the same or there is NullType in the transformed dataframe
    assert all(
        df_sch == exp_sch
        for df_sch, exp_sch in zip_longest(schemas, expected_schema.values())
        if df_sch != "void"
    ), logger.warning(
        f"{collection} - {source} schema validation failure. Column types missmatch. Difference: {print_diff_schema(schemas, expected_schema)}"
    )


def validate_pd_schema(
    df: DataFrame,
    expected_schema: dict,
    collection: str,
    source: Literal["input", "output"],
):
    """Validate Pandas schema"""
    # Assumption: schemas are sorted alphabetically
    df = df.reindex(sorted(df.columns), axis=1)  # Sort pandas df
    expected_schema = sort_dict_schemas(expected_schema)  # Sort expected schema

    columns = list(df.columns)
    actual_schema = get_pd_df_schema(df)

    # All column names are the same
    cols_diff = set(columns) ^ set(expected_schema.keys())
    assert len(cols_diff) == 0, logger.warning(
        f"{collection} - {source} schema validation failure. Column names mismatch. Difference: {cols_diff}"
    )

    # Check schema match between the DataFrames
    assert actual_schema == expected_schema, logger.warning(
        f"{collection} - {source} schema validation failure. Column types mismatch. Difference: {print_diff_schema(list(actual_schema.values()), expected_schema)}"
    )


def get_pd_df_schema(df: DataFrame) -> dict:
    """Get Pandas data schema"""

    def get_column_type(column):
        for val in df[column]:
            if val is not None:
                return type(val).__name__
        return "NoneType"  # If all values are None

    schema = {col: get_column_type(col) for col in df.columns}
    return schema


def print_diff_schema(actual_schema: list[str], expected_schema: dict) -> dict:
    """Print differences between schemas types"""
    differences = {}

    for actual_sch, (key, expected_sch) in zip_longest(
        actual_schema, expected_schema.items()
    ):
        if actual_sch not in (expected_sch, "void"):
            differences[key] = {"ACTUAL": actual_sch, "EXPECTED": expected_sch}

    return differences


def sort_dict_schemas(expected_schema: dict) -> dict:
    """Sort expected dict schema"""
    if list(expected_schema.keys()) != sorted(expected_schema.keys()):
        expected_schema = {k: expected_schema[k] for k in sorted(expected_schema)}

    return expected_schema
