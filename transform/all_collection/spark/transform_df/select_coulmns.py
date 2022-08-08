# pylint: disable=invalid-name
"""Define which columns should be returned"""
from pyspark.sql.dataframe import DataFrame


OAG_COLUMNS = (
    "id",
    "internal_type",
    "title",
    "description",
    "subject",
    "subjects",
    "bestaccessright",
    "language",
    "published",
    "publisher",
    "author_names",
    "document_type",
)

TRAINING_COLUMNS = (
    *OAG_COLUMNS,
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

FINAL_COLUMNS = (
    *TRAINING_COLUMNS,
    "abbreviation",
    "access_policies_url",
    "activate_message",
    "created_at",
    "certifications",
    "changelog",
    "dedicated_for",
    "geographical_availabilities",
    "grant_project_names",
    "language_availability",
    "open_source_technologies",
    "related_platforms",
    "standards",
    "tag_list",
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


def select_oag_columns(df: DataFrame) -> DataFrame:
    """Select only specified columns of OAG dataframe"""
    return df.select(*OAG_COLUMNS)


def select_columns(df: DataFrame) -> DataFrame:
    """Select only specified columns of dataframe"""
    return df.select(*FINAL_COLUMNS)
