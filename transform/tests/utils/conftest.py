# pylint: disable-all
"""Fixtures for schemas tests"""
import pytest
from pyspark.sql.types import (
    ArrayType,
    BooleanType,
    StringType,
    StructField,
    StructType,
)


@pytest.fixture
def hp_sorted_schema() -> StructType:
    """Returns properly alphabetically sorted schema"""
    base_schema = StructType(
        [
            StructField("author_pids", ArrayType(ArrayType(StringType())), True),
            StructField("best_access_right", StringType(), True),
            StructField("country", ArrayType(StringType()), True),
            StructField("document_type", ArrayType(StringType()), True),
            StructField("doi", ArrayType(StringType()), True),
            StructField("funder", ArrayType(StringType()), True),
            StructField("language", ArrayType(StringType()), True),
            StructField("open_access", BooleanType(), True),
            StructField("research_community", ArrayType(StringType()), True),
            StructField("sdg", ArrayType(StringType()), True),
            StructField("unified_categories", ArrayType(StringType()), True),
            StructField("url", ArrayType(StringType()), True),
        ]
    )

    return base_schema


@pytest.fixture
def hp_not_sorted_schema() -> tuple[StructType, StructType]:
    """Returns NOT alphabetically sorted schema and the same schema but properly sorted"""
    not_sorted_schema = StructType(
        [
            StructField("placeholder_", ArrayType(StringType()), True),
            StructField("_placeholder", ArrayType(StringType()), True),
            StructField("author_pids", ArrayType(ArrayType(StringType())), True),
            StructField("best_access_right", StringType(), True),
            StructField("123", StringType(), True),
            StructField("country", ArrayType(StringType()), True),
            StructField("document_type", ArrayType(StringType()), True),
            StructField("XYZ", ArrayType(StringType()), True),
            StructField("doi", ArrayType(StringType()), True),
            StructField("scientific_domains", ArrayType(StringType()), True),
            StructField("funder", ArrayType(StringType()), True),
            StructField("language", ArrayType(StringType()), True),
            StructField("open_access", BooleanType(), True),
            StructField("research_community", ArrayType(StringType()), True),
            StructField("abc_xyz", BooleanType(), True),
            StructField("sdg", ArrayType(StringType()), True),
            StructField("unified_categories", ArrayType(StringType()), True),
            StructField("url", ArrayType(StringType()), True),
        ]
    )

    sorted_schema = StructType(
        [
            StructField("123", StringType(), True),
            StructField("XYZ", ArrayType(StringType()), True),
            StructField("_placeholder", ArrayType(StringType()), True),
            StructField("abc_xyz", BooleanType(), True),
            StructField("author_pids", ArrayType(ArrayType(StringType())), True),
            StructField("best_access_right", StringType(), True),
            StructField("country", ArrayType(StringType()), True),
            StructField("document_type", ArrayType(StringType()), True),
            StructField("doi", ArrayType(StringType()), True),
            StructField("funder", ArrayType(StringType()), True),
            StructField("language", ArrayType(StringType()), True),
            StructField("open_access", BooleanType(), True),
            StructField("placeholder_", ArrayType(StringType()), True),
            StructField("research_community", ArrayType(StringType()), True),
            StructField("scientific_domains", ArrayType(StringType()), True),
            StructField("sdg", ArrayType(StringType()), True),
            StructField("unified_categories", ArrayType(StringType()), True),
            StructField("url", ArrayType(StringType()), True),
        ]
    )

    return not_sorted_schema, sorted_schema
