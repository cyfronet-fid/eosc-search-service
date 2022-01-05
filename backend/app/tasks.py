"""The application tasks"""

import logging
from typing import Callable

from fastapi import FastAPI

from app.db import SessionLocal

logger = logging.getLogger(__name__)


def connect_to_db(app: FastAPI) -> None:
    """Connect to DB"""
    try:
        # pylint: disable=protected-access
        app.state._db = SessionLocal()
    # pylint: disable=broad-except
    except Exception as e:
        logger.warning("--- DB CONNECTION ERROR ---")
        logger.warning(e)
        logger.warning("--- DB CONNECTION ERROR ---")


def close_db_connection(app: FastAPI) -> None:
    """Close connection to DB"""
    try:
        # pylint: disable=protected-access
        app.state._db.close()
    # pylint: disable=broad-except
    except Exception as e:
        logger.warning("--- DB DISCONNECT ERROR ---")
        logger.warning(e)
        logger.warning("--- DB DISCONNECT ERROR ---")


def create_start_app_handler(app: FastAPI) -> Callable:
    """Start app handler"""

    async def start_app() -> None:
        connect_to_db(app)

    return start_app


def create_stop_app_handler(app: FastAPI) -> Callable:
    """Stop app handler"""

    async def stop_app() -> None:
        close_db_connection(app)

    return stop_app
