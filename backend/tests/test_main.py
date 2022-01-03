# pylint: disable=missing-module-docstring,missing-function-docstring

import os
from typing import Generator

import schemathesis
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.db import get_db
from app.main import app

engine = create_engine(
    "postgresql+psycopg2://ess_test:ess_test@localhost:5452/ess_test"
)
TestingSessionLocal = sessionmaker(engine)


def override_get_db() -> Generator[Session, None, None]:
    with TestingSessionLocal() as db:
        yield db


app.dependency_overrides[get_db] = override_get_db

schema = schemathesis.from_path(
    os.path.dirname(__file__) + "/../eosc-search-service-v1.yaml"
)


@schema.parametrize()
def test_api(case) -> None:
    response = case.call_asgi(app)
    case.validate_response(response)
