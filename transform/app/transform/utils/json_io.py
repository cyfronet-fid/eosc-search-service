import json
from typing import List


def read_json(file_path: str) -> List:
    """
    Read JSON lines from a file and return as a list.
    """
    with open(file_path, "r") as f:
        return [json.loads(line) for line in f]


def write_json(file_path: str, data: List) -> None:
    """
    Write a list to a file in JSON format.
    """
    with open(file_path, "w") as f:
        for entry in data:
            json.dump(entry, f, ensure_ascii=False)
            f.write("\n")
