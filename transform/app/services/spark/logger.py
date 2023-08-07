# pylint: disable=missing-function-docstring, missing-class-docstring
"""Spark logger"""
from pyspark.sql import SparkSession


class Log4J:
    def __init__(self, spark: SparkSession):
        root_class = "guru.learningjournal.spark.examples"
        conf = spark.sparkContext.getConf()
        app_name = conf.get("spark.app.name")

        log4j = spark._jvm.org.apache.log4j
        self.logger = log4j.LogManager.getLogger(root_class + "." + app_name)

    def error(self, message: str):
        self.logger.error(message)

    def warn(self, message: str):
        self.logger.warn(message)

    def info(self, message: str):
        self.logger.info(message)

    def debug(self, message: str):
        self.logger.debug(message)
