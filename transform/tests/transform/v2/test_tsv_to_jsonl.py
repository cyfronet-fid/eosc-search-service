import pytest
from transform.v2.tsv_to_jsonl import empty_or_n


@pytest.mark.parametrize("s,expected", [
    ("", True),
    ("   ", True),
    ("\\N", True),
    ("  \\N ", True),
    ("  foo ", False),
])
def test_empty_or_n(s: str, expected: bool):
    assert empty_or_n(s) is expected
