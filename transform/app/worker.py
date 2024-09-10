# pylint: disable=invalid-name, logging-fstring-interpolation
"""Celery worker. Responsibilities: get, transform, upload data"""
import logging.config
import os

from celery import Celery
from celery.signals import after_setup_logger

from app.logger import LOGGING_CONFIG

modules_to_include = [
    "app.tasks.transform.batch",
    "app.tasks.transform.dump.process",
    "app.tasks.transform.dump.validate",
    "app.tasks.transform.dump.load",
    "app.tasks.transform.dump.transform",
    "app.tasks.utils.s3_paths",
    "app.tasks.utils.send",
    "app.tasks.solr.create_collections",
    "app.tasks.solr.create_aliases",
    "app.tasks.solr.delete_collections",
    "app.tasks.solr.delete_data_by_id",
]

celery = Celery(__name__, include=modules_to_include)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get(
    "CELERY_RESULT_BACKEND", "redis://localhost:6379"
)


@after_setup_logger.connect()
def configurate_celery_task_logger(**kwargs):
    """Celery won’t configure the loggers if this signal is connected,
    allowing the logger to utilize our configuration"""
    logging.config.dictConfig(LOGGING_CONFIG)
