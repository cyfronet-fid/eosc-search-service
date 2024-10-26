# pylint: disable=line-too-long, wildcard-import, invalid-name, unused-wildcard-import
"""Transform projects"""

import logging
from datetime import datetime
from typing import List, Optional

from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.functions import col, lit, size, when
from pyspark.sql.types import (
    ArrayType,
    FloatType,
    IntegerType,
    StringType,
    StructField,
    StructType,
)

from app.mappings.currency import currency_mapping
from app.settings import settings
from app.transform.transformers.base.base import BaseTransformer
from app.transform.utils.join_dfs import create_df, join_different_dfs
from app.transform.utils.utils import handle_missing_column, sort_schema
from schemas.old.output.project import project_output_schema
from schemas.properties.data import *


class ProjectTransformer(BaseTransformer):
    """Transformer used to transform projects"""

    def __init__(self, spark: SparkSession):
        self.type = settings.PROJECT
        self.exp_output_schema = project_output_schema

        self.logger = logging.getLogger(__name__)

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
        self.harvest_granted(self, df, self.harvested_properties)
        self.harvest_keywords(df, self.harvested_properties)
        self.harvest_funding(df, self.harvested_properties)
        self.harvest_eosc_score(self.spark, df, self.harvested_properties)
        self.harvest_date_range(df, self.harvested_properties)

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
                    StructField(CURRENCY, StringType(), True),
                    StructField(FUNDING_STREAM_TITLE, ArrayType(StringType()), True),
                    StructField(FUNDING_TITLE, ArrayType(StringType()), True),
                    StructField(KEYWORDS, ArrayType(StringType()), True),
                    StructField(TOTAL_COST, FloatType(), True),
                    StructField(EOSC_SCORE, IntegerType(), True),
                    StructField(DATE_RANGE, StringType(), True),
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
            CALLIDENTIFIER,
            FUNDING,
            GRANTED,
            H2020PROGRAMME,
            KEYWORDS,
            WEBSITEURL,
        )

    @property
    def cols_to_rename(self) -> dict[str, str]:
        """Columns to rename. Keys are mapped to the values"""
        return {
            ACRONYM: ABBREVIATION,
            ENDDATE: END_DATE,
            OPENACCESSMANDATEFORDATASET: OPEN_ACCESS_MANDATE_FOR_DATASET,
            OPENACCESSMANDATEFORPUBLICATIONS: OPEN_ACCESS_MANDATE_FOR_PUBLICATIONS,
            STARTDATE: START_DATE,
            SUMMARY: DESCRIPTION,
        }

    @staticmethod
    def harvest_date_range(df: DataFrame, harvested_properties: dict) -> None:
        """
        Harvests data range from 'start_date' and 'end_date' columns.

        Parameters:
            df (DataFrame): The input DataFrame.
            harvested_properties (dict): The dictionary to be updated with data range.
        """
        end_date_list = df.select(END_DATE).collect()
        start_date_list = df.select(START_DATE).collect()

        def process_date_range(
            end_date_str: Optional[str], start_date_str: Optional[str]
        ) -> Optional[str]:
            """
            Returns a date range string if both 'end_date_str' and 'start_date_str' are provided,
                and end_date >= start_date.
            """
            if end_date_str is None or start_date_str is None:
                return None

            end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()

            if end_date >= start_date:
                return f"[{start_date} TO {end_date}]"
            else:
                return None

        date_range_column = [
            process_date_range(end_date_row[END_DATE], start_date_row[START_DATE])
            for end_date_row, start_date_row in zip(end_date_list, start_date_list)
        ]

        harvested_properties[DATE_RANGE] = date_range_column

    # TODO REFACTOR
    @staticmethod
    def harvest_eosc_score(spark, df: DataFrame, harvested_properties: dict) -> None:
        """
        Harvests EOSC score and updates the 'harvested_properties' dictionary.

        Parameters:
            spark (SparkSession): The Spark session.
            df (DataFrame): The input DataFrame.
            harvested_properties (dict): The dictionary to be updated with EOSC score.
        """

        def create_conditions(joined_dataframe: DataFrame) -> List[when]:
            """Create a list of conditions for EOSC score calculation."""
            return [
                when(
                    (
                        ((col(column) != "") & (col(column).isNotNull()))
                        if joined_dataframe.schema[column].dataType == StringType()
                        else (
                            ((size(col(column)) > 0) & (col(column).isNotNull()))
                            if joined_dataframe.schema[column].dataType
                            == ArrayType(StringType())
                            else col(column).isNotNull()
                        )
                    ),
                    lit(1),
                ).otherwise(lit(0))
                for column in joined_dataframe.columns
            ]

        def calculate_eosc_score(
            dataframe: DataFrame, conditions: List[when]
        ) -> List[int]:
            """Calculate the EOSC score and return a list of scores."""
            eosc_score_column = sum(conditions).alias(EOSC_SCORE)
            dataframe = dataframe.withColumn(EOSC_SCORE, eosc_score_column)
            return dataframe.select(EOSC_SCORE).rdd.flatMap(lambda x: x).collect()

        harvested_properties_schema = StructType(
            [
                StructField("currency", StringType(), True),
                StructField("funding_stream_title", ArrayType(StringType()), True),
                StructField("funding_title", ArrayType(StringType()), True),
                StructField("keywords", ArrayType(StringType()), True),
                StructField("total_cost", FloatType(), True),
            ]
        )

        harvested_properties_df = create_df(
            harvested_properties, harvested_properties_schema, spark
        )

        project_columns = [
            column
            for column in [
                ABBREVIATION,
                CODE,
                DESCRIPTION,
                END_DATE,
                OPEN_ACCESS_MANDATE_FOR_DATASET,
                OPEN_ACCESS_MANDATE_FOR_PUBLICATIONS,
                START_DATE,
                SUBJECT,
                TITLE,
            ]
            if column in df.columns
        ]

        project_df = df.select([df[column] for column in project_columns])

        joined_df = join_different_dfs((project_df, harvested_properties_df))
        eosc_conditions = create_conditions(joined_df)

        eosc_score = calculate_eosc_score(joined_df, eosc_conditions)

        harvested_properties[EOSC_SCORE] = eosc_score

    @staticmethod
    def harvest_funding(df: DataFrame, harvested_properties: dict) -> None:
        """
        Harvest funding information and store the result in the output dictionary.
        Extracts multiple fields from the funding column and save them in EOSC convention.

        funding_stream_description -> funding_stream_title
        funding_name -> funding_title,
        """
        funding_list = df.select(FUNDING).collect()

        funding_stream_title_column = []
        funding_title_column = []

        for funding_row in funding_list:
            funding_stream_title_row = set()
            funding_title_row = set()

            funding = funding_row[FUNDING] or None

            if funding:
                for fund in funding:
                    funding_stream = fund[FUNDING_STREAM] or None

                    if funding_stream:
                        funding_stream_title = funding_stream[DESCRIPTION]

                        funding_stream_title_row.add(funding_stream_title)

                    funding_title = fund[NAME] or None

                    funding_title_row.add(funding_title)

            funding_stream_title_column.append(list(funding_stream_title_row))
            funding_title_column.append(list(funding_title_row))

        harvested_properties[FUNDING_STREAM_TITLE] = funding_stream_title_column
        harvested_properties[FUNDING_TITLE] = funding_title_column

    @staticmethod
    def map_currency_symbol(self, currency_symbol):
        """Maps a currency symbol to its corresponding value. Logs a warning if not found."""
        if (
            currency_symbol not in currency_mapping
            and currency_symbol not in currency_mapping.values()
        ):
            self.logger.warning(f"Unknown {currency_symbol=}")

        mapped_value = currency_mapping.get(currency_symbol, currency_symbol)
        return mapped_value

    @staticmethod
    def harvest_granted(self, df: DataFrame, harvested_properties: dict) -> None:
        """
        Harvest granted information and store the result in the output dictionary.

        Extracts three fields from the granted column: currency and totalcost.
        These values are then stored in separate columns: currency and total_cost.
        """
        granted_list = df.select(GRANTED).collect()

        currency_column = []
        total_cost_column = []

        for granted_row in granted_list:
            granted = granted_row[GRANTED] or None

            if granted:
                currency = self.map_currency_symbol(self, granted[CURRENCY]) or None
                total_cost = None if granted[TOTALCOST] is None else granted[TOTALCOST]

                currency_column.append(currency)
                total_cost_column.append(total_cost)
            else:
                currency_column.append(None)
                total_cost_column.append(None)

        harvested_properties[CURRENCY] = currency_column
        harvested_properties[TOTAL_COST] = total_cost_column

    @staticmethod
    def harvest_keywords(df: DataFrame, harvested_properties: dict) -> None:
        """
        Temp method until openaire relase keyword fix
        Harvests keywords from the specified DataFrame columns, converts them from strings to lists,
        and store them in the output dictionary.
        """
        if not handle_missing_column(
            df, KEYWORDS, harvested_properties, [KEYWORDS], None
        ):

            keywords_list = df.select(KEYWORDS).collect()

            keywords_column = []

            for keywords_row in keywords_list:
                keywords = keywords_row[KEYWORDS] or None

                if keywords:
                    keywords_to_list = [
                        keyword.strip()
                        for keyword in keywords.split(",")
                        if keyword.strip()
                    ]

                    keywords_column.append(keywords_to_list)
                else:
                    keywords_column.append(None)

            harvested_properties[KEYWORDS] = keywords_column
