import fileinput
import csv
import sys
import json


class CustomIterator:
    """
    Removes all nulls from input lines
    """

    def __init__(self, input):
        self.input = input

    def __iter__(self):
        return self

    def __next__(self):
        next = self.input.__next__()
        return next.replace('\x00', '')


if __name__ == "__main__":
    csv.register_dialect("tsv", delimiter='\t')

    inp = fileinput.input(encoding="utf-8")
    it = CustomIterator(inp)

    reader = csv.reader(it, "tsv")
    target_len = 9
    prev_i = None
    count, err = 0, 0
    columns = [
        ("id", False),
        ("pid", True),
        ("title", True),
        ("authors", True),
        ("description", True),
        ("journal", False),
        ("language", True),
        ("subject", True),
        ("fulltext", False),
    ]
    try:
        for i, row in enumerate(reader):
            count += 1
            if len(row) != target_len:
                err += 1
                print(f"Incorrect length. Line {i}: length {len(row)}", file=sys.stderr)
            else:
                out = dict()
                for j, col in enumerate(columns):
                    sep = '\u0002'
                    if sep in row[j] and not col[1]:
                        print(f"Possible array column {j}, in row {i} => {row[j].replace(sep, '<0002>')}",
                              file=sys.stderr)
                    out[col[0]] = row[j].split('\u0002') if col[1] else row[j]
                print(json.dumps(out))
            prev_i = i
    except csv.Error as e:
        print(e)
        print(f"{prev_i + 1}")

    print(f"{err}/{count}", file=sys.stderr)
