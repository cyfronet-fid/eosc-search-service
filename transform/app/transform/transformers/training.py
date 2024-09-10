# pylint: disable=line-too-long, wildcard-import, invalid-name, unused-wildcard-import, duplicate-code
"""Transform trainings"""
import json
from datetime import datetime
from itertools import chain
from logging import getLogger

import pycountry
from dateutil import parser
from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.functions import col, lit, split
from pyspark.sql.types import (
    ArrayType,
    BooleanType,
    DateType,
    StringType,
    StructField,
    StructType,
)

from app.mappings.scientific_domain import sd_training_temp_mapping
from app.services.mp_pc.data import get_providers_mapping
from app.settings import settings
from app.transform.transformers.base.base import BaseTransformer
from app.transform.utils.common import (
    create_open_access,
    create_unified_categories,
    map_best_access_right,
    remove_commas,
    transform_date,
)
from app.transform.utils.utils import sort_schema
from schemas.old.output.training import training_output_schema
from schemas.properties.data import *

logger = getLogger(__name__)


class TrainingTransformer(BaseTransformer):
    """Transformer used to transform training resources"""

    def __init__(self, spark: SparkSession):
        self.type = settings.TRAINING
        self.exp_output_schema = training_output_schema

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
        df = df.withColumn(
            "catalogues", split(col("catalogues"), ",")
        )  # TODO move to cast_columns
        df = df.withColumn(
            "catalogue", self.get_first_element(df["catalogues"])
        )  # TODO delete

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
        df = self.serialize_alternative_ids(df, ALTERNATIVE_IDS)
        df = self.map_providers_and_orgs(df)

        create_unified_categories(df, self.harvested_properties)
        df = remove_commas(df, "author_names", self.harvested_properties)

        return df

    def cast_columns(self, df: DataFrame) -> DataFrame:
        """Cast trainings columns"""
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
                    StructField(ALTERNATIVE_IDS, ArrayType(StringType()), True),
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
                    StructField(PROVIDERS, ArrayType(StringType()), True),
                    StructField(PUBLICATION_DATE, DateType(), True),
                    StructField(RESOURCE_ORGANISATION, StringType(), True),
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
            "alternativeIdentifiers": "alternative_ids",
            "authors": "author_names",
            "catalogueId": "catalogues",
            "contentResourceTypes": "content_type",
            "eoscRelatedServices": "related_services",
            "expertiseLevel": "level_of_expertise",
            "geographicalAvailabilities": "geographical_availabilities",
            "languages": "language",
            "learningOutcomes": "learning_outcomes",
            "learningResourceTypes": "resource_type",
            "qualifications": "qualification",
            "resourceOrganisation": "resource_organisation",
            "resourceProviders": "providers",
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
            "tr_dcmi_type-activity_plan": "Activity Plan",
            "tr_dcmi_type-assessment": "Assessment",
            "tr_dcmi_type-assessment_item": "Assessment Item",
            "tr_dcmi_type-educator_curriculum_guide": "Educator Curriculum Guide",
            "tr_dcmi_type-lesson_plan": "Lesson Plan",
            "tr_dcmi_type-other": "Other",
            "tr_dcmi_type-physical_learning_resource": "Physical Learning Resource",
            "tr_dcmi_type-recorded_lesson": "Recorded Lesson",
            "tr_dcmi_type-supporting_document": "Supporting Document",
            "tr_dcmi_type-textbook": "Textbook",
            "tr_dcmi_type-unit_plan": "Unit Plan",
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

        def map_scientific_domain(sd_raw: str, sd_list: list[str]) -> list[str] | None:
            """Map scientific domain"""
            try:
                sd_mapped = sd_training_temp_mapping[sd_raw.lower()]

                if ">" in sd_mapped:  # If a child is being added
                    if sd_mapped not in sd_list:
                        # Assumption: trusting the data to automatically assign parents to individual children.
                        # Looking at the results, we actually have the most happy paths here.
                        # When we previously added a child along with their parent,
                        # there were almost always more parents than children, and there were definitely fewer happy paths.
                        return [sd_mapped]
                    return None
                else:  # If a parent is being added
                    return [sd_mapped]
            except KeyError:
                if sd_raw != "null":
                    logger.warning(f"Unexpected scientific domain: {sd_raw=}")
                return None  # Don't add unexpected scientific domain to not destroy filter's tree structure

        sci_domains_raw = df.select(SCIENTIFIC_DOMAINS).collect()
        sci_domains_column = []

        for sci_domain in chain.from_iterable(sci_domains_raw):
            sci_domain_row = []
            for sd in chain.from_iterable(sci_domain):
                result_raw = sd.split("-", 1)[1]
                final_sd = map_scientific_domain(result_raw, sci_domain_row)
                if final_sd:
                    sci_domain_row.extend(final_sd)

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

    def serialize_alternative_ids(self, df: DataFrame, _col: str) -> DataFrame:
        """Serialize a single column. Define this column also in harvested_schema.
        Assumption: column is an array of values e.g. dicts"""
        if _col in df.columns:
            raw_prop_col = df.select(_col).collect()
            serialized_prop_col = []

            for rows in chain.from_iterable(raw_prop_col):
                row_list = []
                for row in rows:
                    row_list.append(json.dumps(row.asDict()))
                serialized_prop_col.append(row_list)

            self.harvested_properties[_col] = serialized_prop_col

            return df.drop(_col)
        else:
            length = df.count()
            empty_lists = [[] for _ in range(length)]
            self.harvested_properties[_col] = empty_lists
            return df

    def map_providers_and_orgs(self, df: DataFrame) -> DataFrame:
        """Map pids into names - providers and organisation columns.
        Note: organisations are providers - and they are mandatory, providers are not"""

        def _map(pids_list: str | list[str]) -> list[str]:
            """Map list of pids into a list of names"""
            if isinstance(pids_list, str):
                pids_list = [pids_list]
            output = []
            for pid in pids_list:
                if pid in providers_mapping:
                    output.append(providers_mapping[pid])
                else:
                    logger.warning(f"Unknown training's {pid=}")
                    output.append(pid)
            return output

        providers_mapping = get_providers_mapping()

        for _col in (PROVIDERS, RESOURCE_ORGANISATION):
            pids_col = df.select(_col).collect()
            names_col = [_map(pids) for pids in chain.from_iterable(pids_col)]

            self.harvested_properties[_col] = names_col
            df = df.drop(_col)

        return df
