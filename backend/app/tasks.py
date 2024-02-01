# pylint: disable=no-member
"""The application tasks"""

import logging
from typing import Callable

from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.settings import settings

logger = logging.getLogger(__name__)


def create_session_local() -> sessionmaker:
    """Just creates a new session_local"""
    engine = create_engine(
        settings.DATABASE_URI.unicode_string(), future=True, echo=True
    )
    return sessionmaker(engine)


def connect_to_db(app: FastAPI, session_local: sessionmaker) -> None:
    """Connect to DB"""
    try:
        # pylint: disable=protected-access
        app.state._db = session_local()
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
        connect_to_db(app, create_session_local())

    return start_app


def create_stop_app_handler(app: FastAPI) -> Callable:
    """Stop app handler"""

    async def stop_app() -> None:
        close_db_connection(app)

    return stop_app
