# pylint: disable=invalid-name, logging-fstring-interpolation, broad-except, too-many-arguments
"""Save dataframe"""
import logging
import os
import shutil

import pandas
import pyspark
from pyspark.sql.functions import spark_partition_id

from app.settings import settings

logger = logging.getLogger(__name__)


def save_df(
    df: pyspark.sql.dataframe.DataFrame,
    col_name: str,
    path: str,
    _format="json",
    mode="overwrite",
    verbose=False,
) -> None:
    """Save dataframe"""
    if col_name == settings.GUIDELINE:
        save_pd_df(df, path, verbose)
    else:
        save_spark_df(df, path, _format, mode, verbose)


def save_spark_df(
    df: pyspark.sql.dataframe.DataFrame,
    path: str,
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
        logger.info(f"Dataframe was successfully saved into {path}")


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
            logger.error(f"Failed to delete {file_path}. Reason: {e}")
