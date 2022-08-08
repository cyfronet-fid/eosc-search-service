"""Transform software"""

from pyspark.sql.functions import lit
from pyspark.sql.dataframe import DataFrame
from transform.all_collection.spark.transform_df.select_coulmns import (
    select_oag_columns,
    select_columns,
)
from transform.all_collection.spark.transform_df.oag_transform import (
    add_trainings_services_properties,
)


def transform_software(software: DataFrame) -> DataFrame:
    """
    Required transformations:

    1) Renaming columns
        - bestaccessright column is publisher column (most likely)
        - language column is bestaccessright column
        - journal column is language column

    2) Additional changes:
        - internal_type => software
        - resourceType => rename to document_type

    3) Add trainings and services properties
    """
    software = software.withColumnRenamed("bestaccessright", "publisher")
    software = software.withColumnRenamed("language", "bestaccessright")
    software = software.withColumnRenamed("journal", "language")

    software = software.withColumn("internal_type", lit("software"))
    software = software.withColumnRenamed("resourceType", "document_type")
    software = select_oag_columns(software)

    return select_columns(add_trainings_services_properties(software))
