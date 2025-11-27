#!/usr/bin/env python3
import sys


def usage() -> None:
    print(
        f"Usage: {sys.argv[0]} (sample|range) [start, inclusive]"
        f"[end, exclusive] [count, if sample]"
    )


def pad(num: int) -> str:
    return str(num).zfill(6) + "_0"


def do_sample(start: int, end: int, count: int) -> None:
    import random

    print(" ".join([pad(x) for x in random.sample(range(start, end), count)]))


def do_range(start: int, end: int) -> None:
    print(" ".join([pad(x) for x in range(start, end)]))


if __name__ == "__main__":
    args = sys.argv
    argc = len(args)

    if argc < 4 or argc > 5:
        usage()
        exit(1)

    strategy_name = args[1]

    if strategy_name == "sample":
        if argc < 5:
            usage()
            exit(1)
        do_sample(int(args[2]), int(args[3]), int(args[4]))
    elif strategy_name == "range":
        if argc == 5:
            usage()
            exit(1)
        do_range(int(args[2]), int(args[3]))
    else:
        usage()
        exit(1)
