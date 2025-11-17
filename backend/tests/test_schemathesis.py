# pylint: disable=missing-module-docstring,missing-function-docstring

import os
from datetime import datetime, timezone

import pytest
import schemathesis
from hypothesis import HealthCheck, settings
from sqlalchemy.orm import Session

from app.models import Dump, DumpElement

schema = schemathesis.from_path(
    os.path.dirname(__file__) + "/../eosc-search-service-v1.yaml"
)


@pytest.mark.skip("Enable when we will work with db")
@schema.parametrize()
@settings(suppress_health_check=[HealthCheck.function_scoped_fixture])
async def test_empty_db(case, managed_app) -> None:
    response = case.call_asgi(managed_app)
    case.validate_response(response)


@pytest.mark.skip("Enable when we will work with db")
@schema.parametrize()
@settings(suppress_health_check=[HealthCheck.function_scoped_fixture])
# pylint: disable=redefined-outer-name,unused-argument
async def test_non_empty_db(case, managed_app, prepare_db) -> None:
    response = case.call_asgi(managed_app)
    case.validate_response(response)


@pytest.fixture
def prepare_db(db: Session) -> None:
    s3_prefix = "https://s3.example.org"
    dump = Dump(
        name="foo",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        elements=[
            DumpElement(
                name=f"file_{el_name}",
                reference_type="s3:v1",
                reference=f"{s3_prefix}/foo/v1/{el_name}",
            )
            for el_name in ["bar", "baz", "baz/bar"]
        ],
    )
    db.add(dump)
    db.commit()
