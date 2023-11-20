# pylint: disable=invalid-name, logging-fstring-interpolation
"""Celery worker. Responsibilities: get, transform, upload data"""
import os
from celery import Celery

modules_to_include = [
    "app.tasks.batch",
    "app.tasks.create_collections",
]

celery = Celery(__name__, include=modules_to_include)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379")
celery.conf.result_backend = os.environ.get(
    "CELERY_RESULT_BACKEND", "redis://localhost:6379"
)
