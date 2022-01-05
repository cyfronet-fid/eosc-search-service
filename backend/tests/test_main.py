# pylint: disable=missing-module-docstring,missing-function-docstring

import os

import schemathesis
from hypothesis import HealthCheck, settings

schema = schemathesis.from_path(
    os.path.dirname(__file__) + "/../eosc-search-service-v1.yaml"
)


@schema.parametrize()
@settings(suppress_health_check=[HealthCheck.function_scoped_fixture])
async def test_api(case, app) -> None:
    response = case.call_asgi(app)
    case.validate_response(response)
