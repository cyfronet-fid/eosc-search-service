# pylint: disable=invalid-name
"""Save dataframe"""
from pyspark.sql.dataframe import DataFrame
from pyspark.sql.functions import spark_partition_id
from transform.all_collection.spark.conf.logger import Log4J


def save_df(
    df: DataFrame,
    path: str,
    logger: Log4J,
    _format="json",
    mode="overwrite",
    verbose=True,
):
    """Save dataframe"""
    df.write.format(_format).mode(mode).option("path", path).save()

    if verbose:
        logger.info(f"All collection was successfully saved into: {path}")
        logger.info(f"Num of partitions: {df.rdd.getNumPartitions()}")
        df.groupBy(spark_partition_id()).count().show()
