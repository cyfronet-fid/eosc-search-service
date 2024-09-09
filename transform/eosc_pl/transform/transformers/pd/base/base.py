# pylint: disable=line-too-long, too-many-arguments), invalid-name
"""Base transformer of pandas df"""
import json
from abc import ABC, abstractmethod

from pandas import DataFrame


class BaseTransformer(ABC):
    """Base pandas transformer class"""

    def __init__(
        self,
        desired_type: str,
        cols_to_drop: tuple[str, ...] | None,
        cols_to_rename: dict[str, str] | None,
    ):
        self.type = desired_type
        self._cols_to_drop = cols_to_drop
        self._cols_to_rename = cols_to_rename

    def __call__(self, df: DataFrame) -> DataFrame:
        """Transform resources"""
        df = self.transform(df)
        df = self.apply_common_trans(df)
        df = self.cast_columns(df)

        return df

    def __repr__(self):
        return f"{self.__class__.__name__}({self.type})"

    def apply_common_trans(self, df: DataFrame) -> DataFrame:
        """Apply common transformations"""
        if self._cols_to_drop:
            df = self.drop_columns(df)
        if self._cols_to_rename:
            self.rename_cols(df)
        return df

    def drop_columns(self, df: DataFrame) -> DataFrame:
        """Drop specified columns from a pandas DataFrame."""
        return df.drop(columns=self._cols_to_drop)

    def rename_cols(self, df: DataFrame) -> None:
        """Rename columns based on the mappings dict"""
        df.rename(columns=self._cols_to_rename, inplace=True)

    @staticmethod
    def serialize(df: DataFrame, cols: list[str]) -> None:
        """Serialize columns"""
        for col in cols:
            df[col] = df[col].apply(lambda x: json.dumps(x, indent=2))

    @staticmethod
    def map_str_to_arr(df: DataFrame, cols: list[str]) -> None:
        """Map string columns to array columns"""
        for col in cols:
            df[col] = [[row] for row in df[col]]

    @abstractmethod
    def transform(self, df: DataFrame) -> DataFrame:
        """Apply df transformations"""
        raise NotImplementedError

    @abstractmethod
    def cast_columns(self, df: DataFrame) -> DataFrame:
        """Cast certain columns"""
        raise NotImplementedError

    @property
    @abstractmethod
    def cols_to_rename(self) -> dict[str, str] | None:
        """Columns to rename. Keys are mapped to the values"""
        raise NotImplementedError
