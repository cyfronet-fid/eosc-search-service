"""Transform datasets"""

from pyspark.sql.functions import lit
from pyspark.sql.dataframe import DataFrame
from transform.all_collection.spark.transform_df.select_coulmns import (
    select_oag_columns,
    select_columns,
)
from transform.all_collection.spark.transform_df.oag_transform import (
    add_trainings_services_properties,
)


def transform_datasets(datasets: DataFrame) -> DataFrame:
    """
    Required transformations:

    1) Renaming columns
        - bestaccessright column is publisher column (most likely)
        - language column is bestaccessright column
        - journal column is language column

    2) Additional changes:
        - internal_type => dataset
        - resourceType => rename to document_type

    3) Add trainings and services properties
    """
    datasets = datasets.withColumnRenamed("bestaccessright", "publisher")
    datasets = datasets.withColumnRenamed("language", "bestaccessright")
    datasets = datasets.withColumnRenamed("journal", "language")

    datasets = datasets.withColumn("internal_type", lit("dataset"))
    datasets = datasets.withColumnRenamed("resourceType", "document_type")
    datasets = select_oag_columns(datasets)

    return select_columns(add_trainings_services_properties(datasets))
