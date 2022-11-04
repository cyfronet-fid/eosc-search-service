# pylint: disable=invalid-name, line-too-long, unbalanced-tuple-unpacking
"""Transform services"""

from pyspark.sql.functions import (
    lit,
    split,
    col,
)
from pyspark.sql.dataframe import DataFrame
from pyspark.sql import SparkSession
from pyspark.sql.types import StringType, StructType
from transform.all_collection.spark.utils.join_dfs import join_different_dfs, create_df
from transform.all_collection.spark.transformations.commons import (
    create_open_access,
    map_best_access_right,
)
from transform.all_collection.spark.utils.utils import (
    drop_columns,
    add_columns,
)
from transform.all_collection.spark.schemas.input_col_name import (
    BEST_ACCESS_RIGHT,
    UNIQUE_OAG_AND_TRAINING_COLS,
    UNIQUE_SERVICE_COLS_FOR_DATA_SOURCE,
    UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
)
from transform.all_collection.spark.utils.utils import replace_empty_str


__all__ = ["transform_services", "transform_data_sources"]
SERVICE_TYPE_VALUE = "service"
DATA_SOURCE_TYPE_VALUE = "data source"

COLS_TO_ADD_TO_SERVICE = (
    *UNIQUE_OAG_AND_TRAINING_COLS,
    *UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE,
)
COLS_TO_DROP_TO_SERVICE = ("public_contacts",)
COLS_TO_ADD_DATA_SOURCE = (
    *UNIQUE_OAG_AND_TRAINING_COLS,
    *UNIQUE_SERVICE_COLS_FOR_DATA_SOURCE,
)
COLS_TO_DROP_DATA_SOURCE = ("public_contacts",)


def transform_services(
    services: DataFrame, harvested_schema: StructType, spark: SparkSession
) -> DataFrame:
    """Transform services"""
    harvested_properties = {}

    services = services.withColumn("type", lit(SERVICE_TYPE_VALUE))
    services = rename_and_cast_columns(services)
    services = map_best_access_right(services, harvested_properties, SERVICE_TYPE_VALUE)
    create_open_access(harvested_properties[BEST_ACCESS_RIGHT], harvested_properties)
    services = simplify_urls(services, SERVICE_TYPE_VALUE)

    services = drop_columns(services, COLS_TO_DROP_TO_SERVICE)
    harvested_df = create_df(harvested_properties, harvested_schema, spark)
    services = join_different_dfs((services, harvested_df))
    services = add_columns(services, COLS_TO_ADD_TO_SERVICE)
    services = replace_empty_str(services)
    services = services.select(sorted(services.columns))

    return services


def transform_data_sources(
    data_src: DataFrame, harvested_schema: StructType, spark: SparkSession
) -> DataFrame:
    """Transform data sources"""
    harvested_properties = {}

    data_src = data_src.withColumn("type", lit(DATA_SOURCE_TYPE_VALUE))
    data_src = rename_and_cast_columns(data_src)
    data_src = map_best_access_right(
        data_src, harvested_properties, DATA_SOURCE_TYPE_VALUE
    )
    create_open_access(harvested_properties[BEST_ACCESS_RIGHT], harvested_properties)
    data_src = simplify_urls(data_src, DATA_SOURCE_TYPE_VALUE)

    data_src = drop_columns(data_src, COLS_TO_DROP_DATA_SOURCE)
    harvested_df = create_df(harvested_properties, harvested_schema, spark)
    data_src = join_different_dfs((data_src, harvested_df))
    data_src = add_columns(data_src, COLS_TO_ADD_DATA_SOURCE)
    data_src = replace_empty_str(data_src)
    data_src = data_src.select(sorted(data_src.columns))

    return data_src


def rename_and_cast_columns(services: DataFrame) -> DataFrame:
    """Cast services and data source columns"""
    services = (
        services.withColumn("description", split(col("description"), ","))
        .withColumn("id", services.id.cast(StringType()))
        .withColumnRenamed("created_at", "publication_date")
        .withColumnRenamed("order_type", "best_access_right")
        .withColumnRenamed("language_availability", "language")
        .withColumnRenamed("name", "title")
        .withColumn("publication_date", col("publication_date").cast("date"))
        .withColumn("last_update", col("last_update").cast("date"))
        .withColumn("synchronized_at", col("synchronized_at").cast("date"))
        .withColumn("updated_at", col("updated_at").cast("date"))
    )

    return services


def simplify_urls(df: DataFrame, col_name: str) -> DataFrame:
    """Simplify url columns - get only urls"""
    if col_name not in {SERVICE_TYPE_VALUE, DATA_SOURCE_TYPE_VALUE}:
        raise ValueError(
            f"Collection name={col_name} not in the scope of {SERVICE_TYPE_VALUE, DATA_SOURCE_TYPE_VALUE}"
        )

    if col_name == SERVICE_TYPE_VALUE:
        url_cols_to_simplify = ("multimedia_urls", "use_cases_urls")
    else:
        url_cols_to_simplify = (
            "multimedia_urls",
            "use_cases_urls",
            "link_research_product_metadata_license_urls",
            "research_product_licensing_urls",
        )

    for urls in url_cols_to_simplify:
        df = df.withColumn(urls, col(urls)["url"])
    return df
