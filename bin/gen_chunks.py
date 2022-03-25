#!/usr/bin/env python3

if __name__ == "__main__":
    import random

    print(" ".join([str(x).zfill(6) + '_0' for x in random.sample(range(0, 1000), 30)]))
