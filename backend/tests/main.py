import os

import schemathesis

from app.main import app

schema = schemathesis.from_path(
    os.path.dirname(__file__) + "/../eosc-search-service-v1.yaml"
)


@schema.parametrize()
def test_api(case):
    response = case.call_asgi(app)
    case.validate_response(response)
