import os
from io import StringIO

import pytest
from transform.transform_tsv_to_jsonl.v2.tsv_to_jsonl import (
    empty_or_n,
    transform,
    NullRemovingIterator,
)


@pytest.mark.parametrize(
    "s,expected",
    [
        ("", True),
        ("   ", True),
        ("\\N", True),
        ("  \\N ", True),
        ("  foo ", False),
    ],
)
def test_empty_or_n(s: str, expected: bool):
    assert empty_or_n(s) is expected


def test_transform_works():
    mock_stdout = StringIO()
    mock_stderr = StringIO()

    with open(get_path_for("input_0.tsv"), "r") as inp:
        it = NullRemovingIterator(inp)
        transform(it, mock_stdout, mock_stderr)

    assert mock_stdout.getvalue() == read_file_contents(get_path_for("input_0.stdout"))
    assert mock_stderr.getvalue() == read_file_contents(get_path_for("input_0.stderr"))


def get_path_for(file: str):
    return f"{os.path.dirname(__file__)}/{file}"


def read_file_contents(path: str):
    with open(path, "r") as f:
        return f.read()
