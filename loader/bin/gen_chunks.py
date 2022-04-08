#!/usr/bin/env python3
import sys


def usage() -> None:
    print(f"Usage: {sys.argv[0]} (sample|range) [start, inclusive] [end, exclusive] [count, if sample]")


def pad(num: int) -> str:
    return str(num).zfill(6) + "_0"


def do_sample(start: int, end: int, count: int) -> None:
    import random
    print(" ".join([pad(x) for x in random.sample(range(start, end), count)]))


def do_range(start: int, end: int) -> None:
    print(" ".join([pad(x) for x in range(start, end)]))


if __name__ == "__main__":
    if len(sys.argv) < 4 or len(sys.argv) > 5:
        usage()
        exit(1)

    strategy_name = sys.argv[1]
    match sys.argv[1]:
        case "sample":
            if len(sys.argv) < 5:
                usage()
                exit(1)
            do_sample(int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]))
        case "range":
            if len(sys.argv) == 5:
                usage()
                exit(1)
            do_range(int(sys.argv[2]), int(sys.argv[3]))
        case _:
            usage()
            exit(1)
