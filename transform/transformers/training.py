# pylint: disable=line-too-long, wildcard-import, invalid-name, unused-wildcard-import
"""Transform trainings"""
from itertools import chain
from datetime import datetime
from dateutil import parser
import pycountry
from pyspark.sql.functions import split
from pyspark.sql import SparkSession
from pyspark.sql.types import (
    StructType,
    StructField,
    StringType,
    ArrayType,
    BooleanType,
    DateType,
)
from transformations.common import *
from transformers.base.base import BaseTransformer
from utils.utils import sort_schema
from schemas.properties_name import *


class TrainingTransformer(BaseTransformer):
    """Transformer used to transform training resources"""

    def __init__(self, spark: SparkSession):
        self.type = "training"

        super().__init__(
            self.type, self.cols_to_add, self.cols_to_drop, self.cols_to_rename, spark
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
        df = map_best_access_right(df, self.harvested_properties, self.type)
        create_open_access(self.harvested_properties)
        df = self.map_arr_that_ends_with(df, (CONTENT_TYPE, TARGET_GROUP))
        df = self.map_lvl_of_expertise(df)
        df = self.map_geo_av(df)
        df = self.map_lang(df)
        df = self.map_resource_type(df)
        df = self.map_sci_domains(df)
        df = self.ts_to_iso(df)
        create_unified_categories(df, self.harvested_properties)
        df = remove_commas(df, "author_names", self.harvested_properties)

        return df

    @staticmethod
    def cast_columns(df: DataFrame) -> DataFrame:
        """Cast trainings columns"""
        df = df.withColumn("description", split(col("description"), ","))
        df = df.withColumn("url", split(col("url"), ","))
        df = df.withColumn("duration", col("duration").cast("bigint"))
        df = transform_date(df, "publication_date", "yyyy-MM-dd")
        return df

    @property
    def harvested_schema(self):
        """Schema of harvested properties"""
        return sort_schema(
            StructType(
                [
                    StructField(AUTHOR_NAMES, ArrayType(StringType()), True),
                    StructField(BEST_ACCESS_RIGHT, StringType(), True),
                    StructField(CONTENT_TYPE, ArrayType(StringType()), True),
                    StructField(GEO_AV, ArrayType(StringType()), True),
                    StructField(LANGUAGE, ArrayType(StringType()), True),
                    StructField(LVL_OF_EXPERTISE, StringType(), True),
                    StructField(RESOURCE_TYPE, ArrayType(StringType()), True),
                    StructField(
                        SCIENTIFIC_DOMAINS, ArrayType(ArrayType(StringType())), True
                    ),
                    StructField(TARGET_GROUP, ArrayType(StringType()), True),
                    StructField(OPEN_ACCESS, BooleanType(), True),
                    StructField(PUBLICATION_DATE, DateType(), True),
                    StructField(UNIFIED_CATEGORIES, ArrayType(StringType()), True),
                ]
            )
        )

    @property
    def cols_to_add(self) -> None:
        """Add those columns to the dataframe"""
        return None

    @property
    def cols_to_drop(self) -> tuple:
        """Drop those columns from the dataframe"""
        return ("contact",)

    @property
    def cols_to_rename(self) -> dict[str, str]:
        """Columns to rename. Keys are mapped to the values"""
        return {
            "accessRights": "best_access_right",
            "authors": "author_names",
            "catalogueId": "catalogue",
            "contentResourceTypes": "content_type",
            "eoscRelatedServices": "related_services",
            "expertiseLevel": "level_of_expertise",
            "geographicalAvailabilities": "geographical_availabilities",
            "languages": "language",
            "learningOutcomes": "learning_outcomes",
            "learningResourceTypes": "resource_type",
            "qualifications": "qualification",
            "resourceOrganisation": "resource_organisation",
            "resourceProviders": "eosc_provider",
            "scientificDomains": "scientific_domains",
            "targetGroups": "target_group",
            "urlType": "url_type",
            "versionDate": "publication_date",
        }

    def map_arr_that_ends_with(self, df, cols_list) -> DataFrame:
        """Map content_type target_group values.
        E.g.
        tr_content_resource_type-text -> Text
        tr_content_resource_type-video -> Video
        target_user-researchers -> Researchers"""

        for _col in cols_list:
            df_raw = df.select(_col).collect()
            df_column = []

            for column in chain.from_iterable(df_raw):
                df_column.append([row.split("-")[-1].capitalize() for row in column])

            self.harvested_properties[_col] = df_column
            df = df.drop(_col)

        return df

    def map_lvl_of_expertise(self, df) -> DataFrame:
        """Map level_of_expertise values.
        E.g.
        tr_expertise_level-beginner -> Beginner
        tr_expertise_level-all -> All"""

        lvl_of_exp_raw = df.select(LVL_OF_EXPERTISE).collect()
        lvl_of_exp_column = [
            lvl.split("-")[-1].capitalize()
            for lvl in chain.from_iterable(lvl_of_exp_raw)
        ]

        self.harvested_properties[LVL_OF_EXPERTISE] = lvl_of_exp_column

        return df.drop(LVL_OF_EXPERTISE)

    def map_geo_av(self, df) -> DataFrame:
        """Map geographical_availabilities values.
        E.g.
        WW -> World"""
        geo_av_raw = df.select(GEO_AV).collect()
        geo_av_column = []

        for geo_av in chain.from_iterable(geo_av_raw):
            geo_av_row = []
            for ga in geo_av:
                if ga == "WW":
                    geo_av_row.append("World")
                elif ga == "EO":
                    geo_av_row.append("Europe")
                else:
                    geo_av_row.append(pycountry.countries.get(alpha_2=ga).name)
            geo_av_column.append(geo_av_row)

        self.harvested_properties[GEO_AV] = geo_av_column

        return df.drop(GEO_AV)

    def map_lang(self, df) -> DataFrame:
        """Map language values.
        E.g.
        en -> English"""
        lang_raw = df.select(LANGUAGE).collect()
        lang_column = []

        for lang in chain.from_iterable(lang_raw):
            lang_column.append([pycountry.languages.get(alpha_2=l).name for l in lang])

        self.harvested_properties[LANGUAGE] = lang_column

        return df.drop(LANGUAGE)

    def map_resource_type(self, df) -> DataFrame:
        """Map resource_type values.
        E.g.
        tr_dcmi_type-lesson_plan -> Lesson Plan
        tr_dcmi_type-activity_plan -> Activity Plan"""

        # Keys are mapped into values
        mapping_dict = {
            "tr_dcmi_type-lesson_plan": "Lesson Plan",
            "tr_dcmi_type-activity_plan": "Activity Plan",
            "tr_dcmi_type-assessment": "Assessment",
            "tr_dcmi_type-recorded_lesson": "Recorded Lesson",
            "tr_dcmi_type-supporting_document": "Supporting Document",
            "tr_dcmi_type-other": "Other",
        }

        resource_type_raw = df.select(RESOURCE_TYPE).collect()
        resource_type_column = []

        for resource_type in chain.from_iterable(resource_type_raw):
            resource_type_column.append(
                [mapping_dict.get(rt, rt) for rt in resource_type]
            )

        self.harvested_properties[RESOURCE_TYPE] = resource_type_column

        return df.drop(RESOURCE_TYPE)

    def map_sci_domains(self, df) -> DataFrame:
        """Map scientific_domains values.
        E.g.
        {scientific_domain-generic, scientific_subdomain-generic-generic}
        -> ['Generic', 'Generic>Generic']"""

        sci_domains_raw = df.select(SCIENTIFIC_DOMAINS).collect()
        sci_domains_column = []

        for sci_domain in chain.from_iterable(sci_domains_raw):
            sci_domain_row = []
            for sd in chain.from_iterable(sci_domain):
                result_raw = sd.split("-", 1)[1]
                split_len = len(result_raw.split("-"))
                result = "".join(
                    r.capitalize() if idx == split_len - 1 else r.capitalize() + ">"
                    for idx, r in enumerate(result_raw.split("-"))
                )
                sci_domain_row.append(result)

            sci_domains_column.append([sci_domain_row])
        self.harvested_properties[SCIENTIFIC_DOMAINS] = sci_domains_column

        return df.drop(SCIENTIFIC_DOMAINS)

    def ts_to_iso(self, df: DataFrame) -> DataFrame:
        """Reformat certain columns from unix ts into iso format
        timestamp is provided with millisecond-precision -> 13digits"""
        pub_date_raw = df.select(PUBLICATION_DATE).collect()
        pub_date_column = [
            parser.parse(
                datetime.utcfromtimestamp(int(row) / 1000).isoformat(timespec="seconds")
            )
            for row in chain.from_iterable(pub_date_raw)
        ]
        self.harvested_properties[PUBLICATION_DATE] = pub_date_column

        return df.drop(PUBLICATION_DATE)
