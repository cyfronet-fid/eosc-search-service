# pylint: disable=line-too-long, wildcard-import, invalid-name, unused-wildcard-import
"""Transform organisations"""
import json

from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.functions import lit
from pyspark.sql.types import ArrayType, StringType, StructField, StructType

from app.settings import settings
from app.transform.transformers.base.base import BaseTransformer
from app.transform.utils.utils import sort_schema
from schemas.old.output.organisation import organisation_output_schema
from schemas.properties.data import (
    ABBREVIATION,
    ALTERNATIVE_NAMES,
    ALTERNATIVENAMES,
    COUNTRY,
    LEGALNAME,
    LEGALSHORTNAME,
    PID,
    PIDS,
    TITLE,
    TYPE,
    URL,
    WEBSITEURL,
)


class OrganisationTransformer(BaseTransformer):
    """Transformer used to transform organisations"""

    def __init__(self, spark: SparkSession):
        self.type = settings.ORGANISATION
        self.exp_output_schema = organisation_output_schema

        super().__init__(
            self.type,
            self.cols_to_add,
            self.cols_to_drop,
            self.cols_to_rename,
            self.exp_output_schema,
            spark,
        )

    def apply_simple_trans(self, df: DataFrame) -> DataFrame:
        """Apply simple transformations.
        Simple in a way that there is a possibility to manipulate the main dataframe
        without a need to create another dataframe and merging"""
        df = df.withColumn(TYPE, lit(self.type))
        df = self.rename_cols(df)

        return df

    def apply_complex_trans(self, df: DataFrame) -> DataFrame:
        """Harvest oag properties that requires more complex transformations
        Basically from those harvested properties there will be created another dataframe
        which will be later on merged with the main dataframe"""
        self.harvest_alternative_names(df, self.harvested_properties)
        self.harvest_country(df, self.harvested_properties)
        self.harvest_pids(df, self.harvested_properties)

        return df

    @staticmethod
    def cast_columns(df: DataFrame) -> DataFrame:
        """Cast columns"""
        return df

    @property
    def harvested_schema(self) -> StructType:
        """Schema of harvested properties"""
        return sort_schema(
            StructType(
                [
                    StructField(ALTERNATIVE_NAMES, ArrayType(StringType()), True),
                    StructField(COUNTRY, ArrayType(StringType()), True),
                    StructField(PIDS, StringType(), True),
                ]
            )
        )

    @property
    def cols_to_add(self) -> None:
        """Add those columns to the dataframe"""
        return None

    @property
    def cols_to_drop(self) -> tuple[str, ...]:
        """Drop those columns from the dataframe"""
        return (
            ALTERNATIVENAMES,
            COUNTRY,
            PID,
        )

    @property
    def cols_to_rename(self) -> dict[str, str]:
        """Columns to rename. Keys are mapped to the values"""
        return {
            LEGALNAME: TITLE,
            LEGALSHORTNAME: ABBREVIATION,
            WEBSITEURL: URL,
        }

    @staticmethod
    def harvest_alternative_names(df: DataFrame, harvested_properties: dict) -> None:
        """
        Harvest alternative names from specified DataFrame columns and store the result in the output dictionary.

        Args:
            df (DataFrame): The input DataFrame containing columns for alternative names.
            harvested_properties (Dict[str, List[List[str]]]): A dictionary to store harvested properties.

        Returns:
            None: The function operates in-place, updating the `harvested_properties` dictionary.
        """
        alternative_names_list = df.select(ALTERNATIVENAMES).collect()
        title_list = df.select(TITLE).collect()
        abbreviation_list = df.select(ABBREVIATION).collect()

        alternative_names_column = []

        for alternative_name_row, title_row, abbreviation_row in zip(
            alternative_names_list, title_list, abbreviation_list
        ):
            alternative_names = alternative_name_row[ALTERNATIVENAMES] or []

            filtered_names = [
                name
                for name in alternative_names
                if name not in [title_row[TITLE], abbreviation_row[ABBREVIATION]]
            ]

            alternative_names_column.append(
                sorted(filtered_names) if len(filtered_names) > 0 else None
            )

        harvested_properties[ALTERNATIVE_NAMES] = alternative_names_column

    @staticmethod
    def harvest_country(df: DataFrame, harvested_properties: dict) -> None:
        """Harvest country from country.element.code as string"""
        countries_list = df.select(COUNTRY).collect()
        country_column = []

        for countries in countries_list:
            country_raw_val = countries[COUNTRY] or None
            country_val = country_raw_val["label"] if country_raw_val else None
            country_column.append([country_val])

        harvested_properties[COUNTRY] = country_column

    @staticmethod
    def harvest_pids(df: DataFrame, harvested_properties: dict) -> None:
        """
        Harvest PIDs and store them in the output dictionary.

        Args:
            df (DataFrame): The input DataFrame containing columns for PID information.
            harvested_properties (Dict[str, List[str]]): A dictionary to store harvested properties.

        Returns:
            None: The function operates in-place, updating the 'harvested_properties' dictionary.
        """
        pids_raw_column = df.select(PID).collect()
        pids_column = []

        for pids_list in pids_raw_column:
            pids_row = {}
            pids = pids_list[PID] or []
            for pid in pids:
                scheme = pid["type"].lower() or None
                value = pid["value"] or None

                if scheme in pids_row and scheme is not None:
                    if value not in pids_row[scheme]:
                        pids_row[scheme].append(value)
                elif scheme is not None:
                    pids_row[scheme] = [value]
                else:
                    pass  # Do nothing when scheme is None

            pids_row = dict(sorted(pids_row.items()))
            pids_column.append(json.dumps(pids_row))

        harvested_properties[PIDS] = pids_column
