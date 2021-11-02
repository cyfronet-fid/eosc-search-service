# coding: utf-8

from fastapi.testclient import TestClient


from openapi_server.models.bad_request import BadRequest  # noqa: F401
from openapi_server.models.search_results import SearchResults  # noqa: F401


def test_search_get(client: TestClient):
    """Test case for search_get

    
    """
    params = [("q", 'q_example'),     ("collection", 'collection_example'),     ("cursor", 'cursor_example'),     ("rows", 56)]
    headers = {
        "api_key": "special-key",
    }
    response = client.request(
        "GET",
        "/search",
        headers=headers,
        params=params,
    )

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

