"""Schemas of the harvested properties"""

from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    ArrayType,
    BooleanType,
    LongType,
)
from transform.all_collection.spark.utils.loader import (
    DATASET,
    PUBLICATION,
    SOFTWARE,
    TRAINING,
    SERVICE,
)

__all__ = [
    "harvested_schemas",
]

df_harvested_schema = StructType(
    [
        StructField("author_names", ArrayType(StringType()), True),
        StructField("author_pids", ArrayType(ArrayType(StringType())), True),
        StructField("sdg", ArrayType(StringType()), True),
        StructField("open_access", BooleanType(), True),
        StructField("funder", ArrayType(StringType()), True),
        StructField("url", ArrayType(StringType()), True),
        StructField("document_type", ArrayType(StringType()), True),
        StructField("country", ArrayType(StringType()), True),
        StructField("research_community", ArrayType(StringType()), True),
    ]
)

pub_harvested_schema = StructType(
    [
        StructField("author_names", ArrayType(StringType()), True),
        StructField("author_pids", ArrayType(ArrayType(StringType())), True),
        StructField("sdg", ArrayType(StringType()), True),
        StructField("fos", ArrayType(StringType()), True),
        StructField("open_access", BooleanType(), True),
        StructField("funder", ArrayType(StringType()), True),
        StructField("url", ArrayType(StringType()), True),
        StructField("document_type", ArrayType(StringType()), True),
        StructField("country", ArrayType(StringType()), True),
        StructField("research_community", ArrayType(StringType()), True),
    ]
)

soft_harvested_schema = StructType(
    [
        StructField("author_names", ArrayType(StringType()), True),
        StructField("author_pids", ArrayType(ArrayType(StringType())), True),
        StructField("open_access", BooleanType(), True),
        StructField("funder", ArrayType(StringType()), True),
        StructField("url", ArrayType(StringType()), True),
        StructField("document_type", ArrayType(StringType()), True),
        StructField("country", ArrayType(StringType()), True),
        StructField("research_community", ArrayType(StringType()), True),
    ]
)

train_harvested_schema = StructType(
    [
        StructField("duration", LongType(), True),
        StructField("open_access", BooleanType(), True),
    ]
)

ser_harvested_schema = StructType(
    [
        StructField("open_access", BooleanType(), True),
        StructField("geographical_availabilities", StringType(), True),
        StructField("resource_geographic_locations", StringType(), True),
    ]
)

harvested_schemas = {
    DATASET: df_harvested_schema,
    PUBLICATION: pub_harvested_schema,
    SOFTWARE: soft_harvested_schema,
    TRAINING: train_harvested_schema,
    SERVICE: ser_harvested_schema,
}
