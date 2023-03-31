# pylint: disable=line-too-long, invalid-name, logging-fstring-interpolation
"""Validate transformation"""
import logging
from pyspark.sql import DataFrame

logger = logging.getLogger(__name__)


def check_schema_after_trans(df: DataFrame, expected_schema: dict) -> None:
    """Check whether data schema after transformation has a desired schema"""
    columns = df.columns
    schemas = [column.dataType.simpleString() for column in df.schema.fields]
    # All columns name are the same
    assert columns == list(expected_schema.keys()), logger.error(
        f"Not proper columns name after transformation. Difference: {set(columns) ^ set(expected_schema.keys())}"
    )

    # All schemas for the same columns are the same or there is NullType in the transformed dataframe
    assert all(
        df_sch == exp_sch
        for df_sch, exp_sch in zip(schemas, expected_schema.values())
        if df_sch != "void"
    ), logger.error(
        f"Wrong schema after transformation.\n Dataframe schema={schemas} \n Expected schema={expected_schema.values()}"
    )
