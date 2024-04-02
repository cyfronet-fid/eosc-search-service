# pylint: disable=invalid-name, logging-fstring-interpolation
"""Celery worker. Responsibilities: get, transform, upload data"""
import os

from celery import Celery
from celery.signals import after_setup_logger
import logging.config
from app.logger import LOGGING_CONFIG

modules_to_include = [
    "app.tasks.batch",
    "app.tasks.create_collections",
    "app.tasks.create_aliases",
    "app.tasks.delete_collections",
    "app.tasks.delete_data_by_id",
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
