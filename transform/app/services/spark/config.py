"""Parse Spark configuration"""

import configparser

from pyspark import SparkConf
from pyspark.sql import SparkSession

from app.services.spark.logger import Log4J


def apply_spark_conf() -> [SparkSession, Log4J]:
    """Apply Spark configuration"""
    conf = get_spark_app_config()
    spark = SparkSession.builder.config(conf=conf).getOrCreate()
    spark.sparkContext.setLogLevel("error")
    logger = Log4J(spark)

    return spark, logger


def get_spark_app_config():
    """Get Spark configuration"""
    spark_conf = SparkConf()
    config = configparser.ConfigParser()
    config.read("spark.conf")

    for conf_name, conf_val in config.items("SPARK_APP_CONFIGS"):
        spark_conf.set(conf_name, conf_val)
    spark_conf.set("spark.sql.jsonGenerator.ignoreNullFields", "false")

    return spark_conf
