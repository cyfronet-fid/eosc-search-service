"""Transform trainings"""

from pyspark.sql.functions import lit, split, col
from pyspark.sql.dataframe import DataFrame
from transform.all_collection.spark.transform_df.select_coulmns import select_columns
from transform.all_collection.spark.utils.add_columns_to_df import add_columns


def transform_trainings(trainings: DataFrame) -> DataFrame:
    """
    Required transformations:

    1) Renaming all columns
    2) Additional changes:
        - internal_type => training
    3) Casting columns to different types
    4) Add OAG + services specific columns

    TODO format column, nulls everywhere
    """

    # Rename columns
    trainings = rename_trainings_columns(trainings)
    # Add internal_type
    trainings = trainings.withColumn("internal_type", lit("training"))
    # Cast columns (str -> array)
    trainings = cast_trainings_columns(trainings)
    # Add OAG + services properties
    trainings = add_oag_services_properties(trainings)

    return select_columns(trainings)


def rename_trainings_columns(trainings: DataFrame) -> DataFrame:
    """Rename trainings columns"""
    trainings = (
        trainings.withColumnRenamed("Access_Rights_s", "bestaccessright")
        .withColumnRenamed("Author_ss", "author_names")
        .withColumnRenamed("Content_Type_s", "content_type")
        .withColumnRenamed("Description_s", "description")
        .withColumnRenamed("Duration_s", "duration")
        .withColumnRenamed("EOSC_PROVIDER_s", "eosc_provider")
        .withColumnRenamed("Format_ss", "format")
        .withColumnRenamed("Keywords_ss", "trainings_keywords")
        .withColumnRenamed("Language_s", "language")
        .withColumnRenamed("Level_of_expertise_s", "level_of_expertise")
        .withColumnRenamed("License_s", "license")
        .withColumnRenamed("Qualification_s", "qualification")
        .withColumnRenamed("Resource_Type_s", "document_type")
        .withColumnRenamed("Resource_title_s", "title")
        .withColumnRenamed("Target_group_s", "target_group")
        .withColumnRenamed("URL_s", "url")
        .withColumnRenamed("Version_date__created_in__s", "published")
    )

    return trainings


def cast_trainings_columns(trainings: DataFrame) -> DataFrame:
    """Cast trainings columns"""
    trainings = (
        trainings.withColumn("bestaccessright", split(col("bestaccessright"), ","))
        .withColumn("description", split(col("description"), ","))
        .withColumn("title", split(col("title"), ","))
        .withColumn("published", split(col("published"), ","))
        .withColumn("author_names", split(col("author_names"), ","))
    )
    return trainings


def add_oag_services_properties(trainings: DataFrame) -> DataFrame:
    """Add OAG & services properties to the trainings"""

    arr_to_add = (
        "subject",
        "subjects",
        "publisher",
        "certifications",
        "changelog",
        "dedicated_for",
        "grant_project_names",
        "language_availability",
        "open_source_technologies",
        "related_platforms",
        "standards",
        "tag_list",
    )
    str_to_add = (
        "document_type",
        "abbreviation",
        "access_policies_url",
        "activate_message",
        "created_at",
        "geographical_availabilities",
        "helpdesk_email",
        "helpdesk_url",
        "last_update",
        "maintenance_url",
        "manual_url",
        "name",
        "offers_count",
        "order_type",
        "order_url",
        "payment_model_url",
        "phase",
        "pid",
        "popularity_ratio",
        "pricing_url",
        "privacy_policy_url",
        "project_items_count",
        "provider_id",
        "rating",
        "resource_geographic_locations",
        "restrictions",
        "security_contact_email",
        "sla_url",
        "slug",
        "status",
        "status_monitoring_url",
        "synchronized_at",
        "tagline",
        "terms_of_use_url",
        "training_information_url",
        "updated_at",
        "version",
        "webpage_url",
    )

    trainings = add_columns(arr_to_add, str_to_add, trainings)

    return trainings
