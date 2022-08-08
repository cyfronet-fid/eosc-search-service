# pylint: disable=invalid-name, line-too-long, unbalanced-tuple-unpacking
"""Transform services"""

from typing import List, Tuple
from pyspark.sql.functions import (
    lit,
    split,
    col,
    monotonically_increasing_id,
    row_number,
)
from pyspark.sql.dataframe import DataFrame
from pyspark.sql import SparkSession, Window
from pyspark.sql.types import StringType
from transform.all_collection.spark.transform_df.select_coulmns import select_columns
from transform.all_collection.spark.utils.add_columns_to_df import add_columns


def transform_services(services: DataFrame, spark: SparkSession) -> DataFrame:
    """
    Required transformations:

    1) Additional changes:
        - internal_type => training
        - description from str -> arr
    2) Add OAG + trainings specific columns
    3) Simplify geographical_availabilities and resource_geographic_locations
    """
    services = services.withColumn("internal_type", lit("service"))
    services = cast_services_columns(services)
    services = add_oag_trainings_properties(services)
    services = simplify_geo_properties(services, spark)

    return select_columns(services)


def cast_services_columns(services: DataFrame) -> DataFrame:
    """Cast trainings columns"""
    services = (
        services.withColumn("description", split(col("description"), ","))
        .withColumn("id", services.id.cast(StringType()))
        .withColumn("popularity_ratio", services.popularity_ratio.cast(StringType()))
        .withColumn(
            "project_items_count", services.project_items_count.cast(StringType())
        )
        .withColumn(
            "resource_organisation_id",
            services.resource_organisation_id.cast(StringType()),
        )
        .withColumn(
            "service_opinion_count", services.service_opinion_count.cast(StringType())
        )
        .withColumn("upstream_id", services.upstream_id.cast(StringType()))
    )
    return services


def add_oag_trainings_properties(services: DataFrame) -> DataFrame:
    """Add OAG & trainings properties to the services"""

    arr_to_add = (
        "title",
        "subject",
        "subjects",
        "bestaccessright",
        "published",
        "publisher",
        "author_names",
    )
    str_to_add = (
        "language",
        "document_type",
        "content_type",
        "duration",
        "eosc_provider",
        "format",
        "trainings_keywords",
        "level_of_expertise",
        "license",
        "qualification",
        "target_group",
        "url",
    )

    services = add_columns(arr_to_add, str_to_add, services)

    return services


def simplify_geo_properties(services: DataFrame, spark: SparkSession) -> DataFrame:
    """
    Simplify geographical_availabilities and resource_geographic_locations
    Take only "country_data_or_code" from its very complex schema
    """
    geo_av_list, res_geo_loc_list = extract_most_sign_data_from_geo_cols(services)

    # At this point we do not need those columns; it will be replaced with new schema
    services = services.drop(
        "geographical_availabilities", "resource_geographic_locations"
    )

    services = transform_geo_cols(services, geo_av_list, res_geo_loc_list, spark)
    return services


def extract_most_sign_data_from_geo_cols(services: DataFrame) -> [List, List]:
    """
    Extract most significant data from geographical_availabilities and resource_geographic_locations cols
    to enable simplifying the structure of that data
    """
    geo_av = services.select("geographical_availabilities").collect()
    res_geo_loc = services.select("resource_geographic_locations").collect()

    geo_av_list = []
    for geo in geo_av:
        country_code = geo.geographical_availabilities[0].country_data_or_code
        geo_av_list.append(country_code)

    res_geo_loc_list = []
    for res_geo in res_geo_loc:
        try:
            country_code = res_geo.resource_geographic_locations[0].country_data_or_code
            res_geo_loc_list.append(country_code)
        except TypeError:
            res_geo_loc_list.append(None)

    return geo_av_list, res_geo_loc_list


def transform_geo_cols(
    services: DataFrame, geo_av_list: List, res_geo_loc_list: List, spark: SparkSession
) -> DataFrame:
    """Transform geographical_availabilities and resource_geographic_locations columns"""
    geo_av_df = spark.createDataFrame(
        [(geo_av,) for geo_av in geo_av_list], ["geographical_availabilities"]
    )
    res_geo_loc_df = spark.createDataFrame(
        [(res_geo_loc,) for res_geo_loc in res_geo_loc_list],
        ["resource_geographic_locations"],
    )

    services = join_services_dfs(services, geo_av_df, res_geo_loc_df)
    return services


def add_row_idxes(df_seq: Tuple) -> List:
    """Add row_idxes to dataframes"""
    final_df_list = []
    for df in df_seq:
        df = df.withColumn(
            "row_idx", row_number().over(Window.orderBy(monotonically_increasing_id()))
        )
        final_df_list.append(df)

    return final_df_list


def join_services_dfs(
    services: DataFrame, geo_av_df: DataFrame, res_geo_loc_df: DataFrame
) -> DataFrame:
    """Join services dataframes based on row_idx"""
    # Add 'sequential' index and join dataframes
    services, geo_av_df = add_row_idxes((services, geo_av_df))
    services = services.join(geo_av_df, services.row_idx == geo_av_df.row_idx).drop(
        "row_idx"
    )

    services, res_geo_loc_df = add_row_idxes((services, res_geo_loc_df))
    services = services.join(
        res_geo_loc_df, services.row_idx == res_geo_loc_df.row_idx
    ).drop("row_idx")

    return services
