# pylint: disable=redefined-outer-name,unused-argument,wrong-import-order

"""Test config"""
import uuid

import pytest
from asgi_lifespan import LifespanManager
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.orm import Session

import alembic
from alembic.config import Config
from app.schemas.session_data import SessionData
from app.server import get_app
from app.utils.cookie_validators import backend, cookie
from tests.utils import UserSession


@pytest.fixture
def apply_migrations() -> None:
    """Apply DB migrations in TESTING environment."""
    config = Config("alembic.ini")

    alembic.command.upgrade(config, "head")
    yield
    alembic.command.downgrade(config, "base")


@pytest.fixture
def app() -> FastAPI:
    """FastAPI application"""
    return get_app()


@pytest.fixture
async def client(app: FastAPI) -> AsyncClient:
    """Get lifecycle-managed AsyncClient"""
    async with AsyncClient(
        app=app,
        base_url="http://testserver",
        headers={"Content-Type": "application/json"},
    ) as client:
        yield client


@pytest.fixture
async def user_session() -> UserSession:
    """Create in memory user session and return UserSession object"""
    session_id = uuid.uuid4()

    session = SessionData(
        username="testuser@test",
        aai_state="12345",
        aai_id="test",
        session_uuid=str(uuid.uuid4()),
    )
    await backend.create(session_id, session)
    return UserSession(backend_session_id=session_id, session_data=session)


@pytest.fixture
async def auth_client(app: FastAPI, user_session: UserSession) -> AsyncClient:
    """Get authorized lifecycle-managed AsyncClient"""
    cookies = {
        cookie.model.name: str(cookie.signer.dumps(user_session.backend_session_id.hex))
    }

    async with AsyncClient(
        app=app,
        base_url="http://testserver",
        headers={"Content-Type": "application/json"},
        cookies=cookies,
    ) as client:
        yield client


@pytest.fixture
async def managed_app(app: FastAPI, apply_migrations: None) -> FastAPI:
    """FastAPI application with managed lifecycle"""
    async with LifespanManager(app):
        yield app


@pytest.fixture
def db(managed_app) -> Session:
    """Extract Session from app state"""
    # pylint: disable=protected-access
    return managed_app.state._db
