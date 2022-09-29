# pylint: disable=fixme
"""Starting schemas"""
from pyspark.sql.types import (
    StructType,
    StructField,
    DateType,
    StringType,
    ArrayType,
)


ds_software_schema = StructType(
    [
        StructField("author_names", ArrayType(StringType())),
        StructField("author_pids", ArrayType(StringType())),
        StructField("bestaccessright", ArrayType(StringType())),  # publisher in reality
        StructField("description", ArrayType(StringType())),
        StructField("fulltext", StringType()),
        StructField("id", StringType()),
        StructField("journal", StringType()),  # language in reality
        StructField("language", ArrayType(StringType())),  # bestaccessright in reality
        StructField("organization_ids", ArrayType(StringType())),
        StructField("organization_names", ArrayType(StringType())),
        StructField("organization_shorts", ArrayType(StringType())),
        StructField("pid", ArrayType(StringType())),
        StructField("project_codes", ArrayType(StringType())),
        StructField("project_ids", ArrayType(StringType())),
        StructField("project_titles", ArrayType(StringType())),
        StructField("published", ArrayType(DateType())),
        StructField("resourceType", StringType()),
        StructField("subject", ArrayType(StringType())),
        StructField("subjects", ArrayType(StringType())),
        StructField("title", ArrayType(StringType())),
    ]
)

publication_schema = StructType(
    [
        StructField("author_names", ArrayType(StringType())),
        StructField("author_pids", ArrayType(StringType())),
        StructField("bestaccessright", ArrayType(StringType())),
        StructField("description", ArrayType(StringType())),
        StructField("fulltext", StringType()),
        StructField("id", StringType()),
        StructField("journal", StringType()),
        StructField("language", ArrayType(StringType())),
        StructField("organization_ids", ArrayType(StringType())),
        StructField("organization_names", ArrayType(StringType())),
        StructField("organization_shorts", ArrayType(StringType())),
        StructField("pid", ArrayType(StringType())),
        StructField("project_codes", ArrayType(StringType())),
        StructField("project_ids", ArrayType(StringType())),
        StructField("project_titles", ArrayType(StringType())),
        StructField("published", ArrayType(DateType())),
        StructField("publisher", StringType()),
        StructField("resourceType", StringType()),
        StructField("subject", ArrayType(StringType())),
        StructField("subjects", ArrayType(StringType())),
        StructField("title", ArrayType(StringType())),
    ]
)

trainings_schema = (
    StructType(  # TODO for some reason it clears all data, for now it's not used
        [
            StructField("Access_Rights_s", StringType()),
            StructField("Author_ss", ArrayType(StringType())),
            StructField("Content_Type_s", StringType()),
            StructField("Description_s", StringType()),
            StructField("Duration_s", StringType()),
            StructField("EOSC_PROVIDER_s", StringType()),
            StructField("Format_ss", ArrayType(StringType())),
            StructField("Keywords_ss", ArrayType(StringType())),
            StructField("Language_s", StringType()),
            StructField("Level_of_expertise_s", StringType()),
            StructField("License_s", StringType()),
            StructField("Qualification_s", StringType()),
            StructField("Resource_Type_s", StringType()),
            StructField("Resource_title_s", StringType()),
            StructField("Target_group_s", StringType()),
            StructField("URL_s", StringType()),
            StructField("Version_date__created_in__s", StringType()),
            StructField("id", StringType()),
        ]
    )
)

services_schema = (
    StructType(  # TODO for some reason it clears all data, for now it's not used
        [
            StructField("abbreviation", StringType()),
            StructField("access_policies_url", StringType()),
            StructField("activate_message", StringType()),
            StructField("certifications", ArrayType(StringType())),
            StructField("changelog", ArrayType(StringType())),
            StructField("created_at", DateType()),
            StructField("dedicated_for", ArrayType(StringType())),
            StructField("description", ArrayType(StringType())),
        ]
    )
)
