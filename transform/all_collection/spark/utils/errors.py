# pylint: disable=line-too-long, missing-class-docstring, missing-function-docstring
"""This module contains custom error classes"""


class DataPathsNotProvidedError(Exception):
    def message(self):
        return "At least one from DATASET_PATH, PUBLICATION_PATH, SOFTWARE_PATH was not provided"
