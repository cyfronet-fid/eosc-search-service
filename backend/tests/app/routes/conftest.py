# pylint: disable=missing-module-docstring,missing-function-docstring
import json
from pathlib import Path
from unittest.mock import AsyncMock, Mock, create_autospec

import pytest
from fastapi import FastAPI

from app.solr.operations import get, get_dep, search, search_dep


@pytest.fixture
def mock_solr_get(app: FastAPI) -> AsyncMock:
    mock_get_item = get_mocked_get_response_content(
        "test_data_research_product_by_id.json"
    )

    app.dependency_overrides[get_dep] = lambda: mock_get_item
    yield mock_get_item
    del app.dependency_overrides[get_dep]


@pytest.fixture
def mock_post_search(app: FastAPI) -> AsyncMock:
    mock_search = get_mocked_search_response_content("test_search.post.response.json")

    app.dependency_overrides[search_dep] = lambda: mock_search
    yield mock_search
    del app.dependency_overrides[search_dep]


def get_mocked_search_response_content(file: str) -> AsyncMock:
    mock_json = read_file_as_json(file)
    mock_return = Mock()
    mock_return.collection = "publication"
    mock_return.data = mock_json
    return create_autospec(search, return_value=mock_return)


def get_mocked_get_response_content(file: str) -> AsyncMock:
    mock_json = read_file_as_json(file)
    mock_return = Mock()
    mock_return.is_error = False
    mock_return.json = Mock(return_value=mock_json)
    return create_autospec(get, return_value=mock_return)


def read_file_as_json(file: str):
    file_path = Path(__file__).parent / file
    with open(file_path, "r", encoding="utf-8") as f:
        file_content = f.read()

    return json.loads(file_content)
