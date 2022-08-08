"""Transform publications"""

from pyspark.sql.functions import lit, col, concat_ws, split
from pyspark.sql.dataframe import DataFrame
from transform.all_collection.spark.transform_df.select_coulmns import (
    select_oag_columns,
    select_columns,
)
from transform.all_collection.spark.transform_df.oag_transform import (
    add_trainings_services_properties,
)


def transform_publications(publications: DataFrame) -> DataFrame:
    """
    Required transformations:

    1) Type fixing
        - language is an array not a string as in dataset & software
        - publisher is a string not an array as in dataset & software

    2) Additional changes
        - internal_type => publication
        - resourceType => rename to document_type

    3) Add trainings and services properties
    """
    publications = publications.withColumn("language", concat_ws(",", col("language")))
    publications = publications.withColumn("publisher", split(col("publisher"), ","))
    publications = publications.withColumn("internal_type", lit("publication"))
    publications = publications.withColumnRenamed("resourceType", "document_type")
    publications = select_oag_columns(publications)

    return select_columns(add_trainings_services_properties(publications))
