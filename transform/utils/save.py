# pylint: disable=invalid-name, logging-fstring-interpolation, broad-except, too-many-arguments
"""Save dataframe"""
import os
import shutil
import logging
import pyspark
from pyspark.sql.functions import spark_partition_id
import pandas
from transform.conf.logger import Log4J
from transform.utils.loader import (
    LOCAL_DUMP_PATH,
    ALL_COLLECTION,
    SEPARATE_COLLECTION,
    CREATE_LOCAL_DUMP,
    GUIDELINE,
)

py_logger = logging.getLogger(__name__)


def save_df(
    df: pyspark.sql.dataframe.DataFrame,
    col_name: str,
    path: str,
    logger: Log4J,
    _format="json",
    mode="overwrite",
    verbose=False,
) -> None:
    """Save dataframe"""
    if col_name == GUIDELINE:
        save_pd_df(df, path, verbose)
    else:
        save_spark_df(df, path, logger, _format, mode, verbose)


def save_spark_df(
    df: pyspark.sql.dataframe.DataFrame,
    path: str,
    logger: Log4J,
    _format="json",
    mode="overwrite",
    verbose=False,
) -> None:
    """Save spark dataframe"""
    df.write.format(_format).mode(mode).option("path", path).save()

    if verbose:
        logger.info(f"All collection was successfully saved into: {path}")
        logger.info(f"Num of partitions: {df.rdd.getNumPartitions()}")
        df.groupBy(spark_partition_id()).count().show()


def save_pd_df(
    df: pandas.DataFrame,
    path: str,
    verbose=False,
) -> None:
    """Save pandas dataframe"""
    clear_folder(path)
    path = os.path.join(path, "guideline.json")
    df.to_json(path, orient="records", lines=True)

    if verbose:
        py_logger.info(f"Dataframe was successfully saved into {path}")


def create_dump_struct(env_vars: dict) -> None:
    """Create structure (directories) for the local dump"""
    if env_vars[CREATE_LOCAL_DUMP]:
        dump_path = env_vars[LOCAL_DUMP_PATH]
        os.mkdir(dump_path)

        for col in env_vars[ALL_COLLECTION] | env_vars[SEPARATE_COLLECTION]:
            os.mkdir(os.path.join(dump_path, col.lower()))


def make_archive(env_vars: dict) -> None:
    """Compress the dump and delete the directory"""
    shutil.make_archive(env_vars[LOCAL_DUMP_PATH], "zip", env_vars[LOCAL_DUMP_PATH])
    shutil.rmtree(env_vars[LOCAL_DUMP_PATH])


def clear_folder(folder) -> None:
    """Delete all files in the directory"""
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            py_logger.error(f"Failed to delete {file_path}. Reason: {e}")
