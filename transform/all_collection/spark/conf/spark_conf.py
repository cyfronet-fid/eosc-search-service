"""Parse Spark configuration"""
import configparser
from pyspark import SparkConf


def get_spark_app_config():
    """Get Spark configuration"""
    spark_conf = SparkConf()
    config = configparser.ConfigParser()
    config.read("spark.conf")

    for conf_name, conf_val in config.items("SPARK_APP_CONFIGS"):
        spark_conf.set(conf_name, conf_val)
    spark_conf.set("spark.sql.jsonGenerator.ignoreNullFields", "false")

    return spark_conf
