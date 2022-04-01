# pylint: disable=redefined-outer-name,unused-argument

"""Test config"""
import pytest
from asgi_lifespan import LifespanManager
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session

import alembic
from alembic.config import Config
from app.server import get_app


@pytest.fixture
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


@pytest.fixture
def db(app: FastAPI) -> Session:
    """Extract Session from app state"""
    # pylint: disable=protected-access
    return app.state._db


@pytest.fixture
async def client(app: FastAPI) -> AsyncClient:
    """Get lifecycle-managed AsyncClient"""
    async with AsyncClient(
        app=app,
        base_url="http://testserver",
        headers={"Content-Type": "application/json"},
    ) as client:
        yield client
