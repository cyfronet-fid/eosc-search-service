# coding: utf-8

from fastapi.testclient import TestClient


from search_service.models.bad_request import BadRequest  # noqa: F401
from search_service.models.forbidden import Forbidden  # noqa: F401
from search_service.models.inline_object import InlineObject  # noqa: F401
from search_service.models.recommend_results import RecommendResults  # noqa: F401
from search_service.models.search_results import SearchResults  # noqa: F401
from search_service.models.unauthorized import Unauthorized  # noqa: F401


def test_recommend_post(client: TestClient):
    """Test case for recommend_post

    Returns results
    """
    inline_object = search_service.InlineObject()
    params = [("q", 'q_example'),     ("collection", 'collection_example')]
    headers = {
        "Authorization": "Bearer special-key",
    }
    response = client.request(
        "POST",
        "/recommend",
        headers=headers,
        json=inline_object,
        params=params,
    )

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200


def test_search_get(client: TestClient):
    """Test case for search_get

    Returns results
    """
    params = [("q", 'q_example'),     ("collection", 'collection_example'),     ("sort", ['[\"name, desc\",\"another,asc\"]']),     ("cursor", 'cursor_example'),     ("rows", 56)]
    headers = {
        "Authorization": "Bearer special-key",
    }
    response = client.request(
        "GET",
        "/search",
        headers=headers,
        params=params,
    )

    # uncomment below to assert the status code of the HTTP response
    #assert response.status_code == 200

