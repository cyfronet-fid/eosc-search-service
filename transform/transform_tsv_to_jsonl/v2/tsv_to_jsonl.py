import fileinput
import csv
import os
import sys
import json


class NullRemovingIterator:
    """
    Removes all nulls from input lines
    """

    def __init__(self, input: [str]):
        self.input = input

    def __iter__(self):
        return self

    def __next__(self):
        next = self.input.__next__()
        return next.replace("\x00", "")


def empty_or_n(s: str):
    return not s or s.isspace() or s.strip() == "\\N"


list_sep = "\u0002"
struct_sep = "\u0003"


def transform(it: NullRemovingIterator, stdout=sys.stdout, stderr=sys.stderr):
    csv.field_size_limit(sys.maxsize)
    csv.register_dialect("tsv", delimiter="\t")

    reader = csv.reader(it, "tsv")
    columns = [
        ("id", False),
        ("pid", True),
        ("title", True),
        ("description", True),
        ("subject", True),
        ("publisher", False),
        ("bestaccessright", True),
        ("language", True),
        ("journal", False),
        ("fulltext", False),
        ("published", True),
        ("author", True, ["names", "pids"]),
        ("organization", True, ["names", "shorts", "ids"]),
        ("project", True, ["titles", "ids", "codes"]),
    ]
    if os.getenv("OMIT_JOURNAL"):
        columns = [c for c in columns if c[0] != "journal"]
    target_len = len(columns)
    prev_i = None
    count, err = 0, 0
    try:
        for i, row in enumerate(reader):
            count += 1
            if len(row) != target_len:
                err += 1
                print(f"Incorrect length. Line {i}: length {len(row)}", file=stderr)
            else:
                row_errored = False
                out = dict()
                for j, col in enumerate(columns):
                    col_name = col[0]
                    is_list = col[1]
                    try:
                        named_struct = col[2]
                    except IndexError:
                        named_struct = None
                    if list_sep in row[j] and not is_list:
                        print(
                            f"Possible array column {col_name}, in row {i} => {row[j].replace(list_sep, '<0002>')}",
                            file=stderr,
                        )
                    if struct_sep in row[j] and named_struct is None:
                        print(
                            f"Possible struct column {col_name}, in row {i} => {row[j].replace(struct_sep, '<0003>')}",
                            file=stderr,
                        )
                    if is_list:
                        out_val = [
                            v for v in row[j].split(list_sep) if not empty_or_n(v)
                        ]
                        if named_struct is None:
                            out[col_name] = out_val
                        else:
                            split_val = [v.split(struct_sep) for v in out_val]
                            for k, field in enumerate(named_struct):
                                try:
                                    out[col_name + "_" + field] = [
                                        v[k] for v in split_val
                                    ]
                                except IndexError:
                                    print(
                                        f"IndexError {col_name}, in row {i} => {row[j].replace(struct_sep, '<0003>')}",
                                        file=stderr,
                                    )
                                    if not row_errored:
                                        err += 1
                                    row_errored = True
                    else:
                        out[col_name] = None if empty_or_n(row[j]) else row[j]
                if not row_errored:
                    print(json.dumps(out), file=stdout)
            prev_i = i
    except csv.Error as e:
        print(e, file=stderr)
        print(f"{prev_i + 1}", file=stderr)

    print(f"{err}/{count}", file=stderr)


if __name__ == "__main__":
    inp = fileinput.input(encoding="utf-8")
    it = NullRemovingIterator(inp)
    transform(it)
