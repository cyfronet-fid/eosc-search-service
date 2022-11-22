# pylint: disable=invalid-name
"""Save dataframe"""
import os
import shutil
from typing import Dict
from pyspark.sql.dataframe import DataFrame
from pyspark.sql.functions import spark_partition_id
from transform.all_collection.spark.conf.logger import Log4J
from transform.all_collection.spark.utils.loader import (
    LOCAL_DUMP_PATH,
    COLLECTIONS,
    CREATE_LOCAL_DUMP,
)


def save_df(
    df: DataFrame,
    path: str,
    logger: Log4J,
    _format="json",
    mode="overwrite",
    verbose=False,
):
    """Save dataframe"""
    df.write.format(_format).mode(mode).option("path", path).save()

    if verbose:
        logger.info(f"All collection was successfully saved into: {path}")
        logger.info(f"Num of partitions: {df.rdd.getNumPartitions()}")
        df.groupBy(spark_partition_id()).count().show()


def create_dump_struct(env_vars: Dict) -> None:
    """Create structure (directories) for the local dump"""
    if env_vars[CREATE_LOCAL_DUMP]:
        dump_path = env_vars[LOCAL_DUMP_PATH]
        os.mkdir(dump_path)

        for col in env_vars[COLLECTIONS]:
            os.mkdir(os.path.join(dump_path, col.lower()))


def make_archive(env_vars: Dict) -> None:
    """Compress the dump and delete the directory"""
    shutil.make_archive(env_vars[LOCAL_DUMP_PATH], "zip", env_vars[LOCAL_DUMP_PATH])
    shutil.rmtree(env_vars[LOCAL_DUMP_PATH])
