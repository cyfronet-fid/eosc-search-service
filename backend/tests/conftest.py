# pylint: disable=redefined-outer-name,unused-argument

"""Test config"""

import pytest
from asgi_lifespan import LifespanManager
from fastapi import FastAPI

import alembic
from alembic.config import Config
from app.server import get_app


@pytest.fixture(scope="session")
def apply_migrations():
    """Apply DB migrations in TESTING environment."""
    config = Config("alembic.ini")

    alembic.command.upgrade(config, "head")
    yield
    alembic.command.downgrade(config, "base")


@pytest.fixture
async def app(apply_migrations: None) -> FastAPI:
    """FastAPI application with managed lifecycle"""
    app = get_app()
    async with LifespanManager(app):
        yield app
