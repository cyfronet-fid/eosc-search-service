# pylint: disable-all
from app.transform.utils.utils import sort_schema


def test_sort_schema(hp_sorted_schema, hp_not_sorted_schema):
    """
    Test sorting

    Cases:
        1) Correctly, alphabetically sorted schema after sorting is the same
        2) Not sorted schema after sorting is properly alphabetically sorted
    """
    # 1)
    schema = sort_schema(hp_sorted_schema)
    assert schema == hp_sorted_schema

    # 2)
    mocked_not_sorted_schema, mocked_sorted_schema = hp_not_sorted_schema
    sorted_schema = sort_schema(mocked_not_sorted_schema)

    assert sorted_schema == mocked_sorted_schema
