# pylint: disable=invalid-name
"""Add trainings and services properties to OAG resources"""
from pyspark.sql import DataFrame
from transform.all_collection.spark.utils.add_columns_to_df import add_columns


def add_trainings_services_properties(df: DataFrame) -> DataFrame:
    """Add OAG & trainings properties to the services"""

    arr_to_add = (
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

    df = add_columns(arr_to_add, str_to_add, df)

    return df
