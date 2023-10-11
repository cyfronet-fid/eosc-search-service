# pylint: disable=line-too-long, invalid-name, logging-fstring-interpolation
"""Validate transformation"""
import logging
from pyspark.sql import DataFrame

logger = logging.getLogger(__name__)


def check_schema_after_trans(df: DataFrame, expected_schema: dict, collection: str) -> None:
    """Check whether data schema after transformation has a desired schema"""
    columns = df.columns
    schemas = [column.dataType.simpleString() for column in df.schema.fields]

    # All columns name are the same
    assert columns == list(expected_schema.keys()), logger.error(
        f"{collection} - output schema validation failure. Output column names mismatch. Difference: {set(columns) ^ set(expected_schema.keys())}"
    )

    # All schemas for the same columns are the same or there is NullType in the transformed dataframe
    assert all(
        df_sch == exp_sch
        for df_sch, exp_sch in zip(schemas, expected_schema.values())
        if df_sch != "void"
    ), logger.error(
        f"{collection} - output schema validation failure. Output column types missmatch. Difference: {print_diff_schema(schemas, expected_schema)}"
    )


def print_diff_schema(output_schema: list[str], expected_schema: dict) -> dict:
    """Print differences between schemas types"""
    differences = {}
    for output_sch, (key, expected_sch) in zip(output_schema, expected_schema.items()):
        if output_sch not in (expected_sch, "void"):
            differences[key] = {"OUTPUT": output_sch, "EXPECTED": expected_sch}
    return differences
