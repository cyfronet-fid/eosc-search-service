#!/usr/bin/env bash

pipenv run python transform/v2/tsv_to_jsonl.py ../tmp/20220323-memory-test/downloaded/$1 > ../tmp/20220323-memory-test/processed/$1.jsonl
