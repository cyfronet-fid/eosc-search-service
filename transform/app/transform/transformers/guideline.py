# pylint: disable=line-too-long, invalid-name, logging-fstring-interpolation, too-many-locals, duplicate-code, fixme
"""Transform interoperability guidelines"""
import json
import logging
from datetime import datetime

import pandas as pd
from pandas import DataFrame

from app.services.mp_pc.data import get_providers_mapping
from app.services.solr.validate.schema.validate import validate_pd_schema
from app.settings import settings
from schemas.old.input.guideline import guideline_input_schema
from schemas.old.output.guideline import guideline_output_schema
from schemas.properties.data import (
    ALTERNATIVE_IDS,
    AUTHOR_NAMES,
    AUTHOR_NAMES_TG,
    DOI,
    TYPE,
    URI,
)

logger = logging.getLogger(__name__)

IDENTIFIER_INFO = "identifierInfo"
IDENTIFIER = "identifier"
IDENTIFIER_TYPE = "identifierType"
RESOURCE_TYPE_INFO = "resourceTypesInfo"

CREATORS = "creators"
AUTHOR_TYPES = "author_types"
AUTHOR_GIVEN_NAMES = "author_given_names"
AUTHOR_FAMILY_NAMES = "author_family_names"
AUTHOR_NAMES_ID = "author_names_id"
AUTHOR_AFFILIATIONS = "author_affiliations"
AUTHOR_AFFILIATIONS_ID = "author_affiliations_id"

TYPE_INFO = "type_info"
TYPE_GENERAL = "type_general"

RELATED_STANDARDS = "relatedStandards"
RELATED_STANDARDS_ID = "related_standards_id"
RELATED_STANDARDS_URI = "related_standards_uri"

RIGHTS = "rights"
RIGHT_TITLE_RAW = "rightTitle"
RIGHT_URI_RAW = "rightURI"
RIGHT_ID_RAW = "rightIdentifier"
RIGHT_TITLE = "right_title"
RIGHT_URI = "right_uri"
RIGHT_ID = "right_id"


def harvest_identifiers(df: DataFrame) -> None:
    """Harvest DOI  and URI from identifierInfo of interoperability guideline"""
    column = df[IDENTIFIER_INFO]
    doi = []
    uri = []

    for row in column:
        match row[IDENTIFIER_TYPE]:
            case "ir_identifier_type-doi":
                doi.append([row[IDENTIFIER]])
                uri.append([])
            case "ir_identifier_type-uri":
                doi.append([])
                uri.append([row[IDENTIFIER]])
            case _:
                doi.append([])
                uri.append([])
                logger.warning(f"Unknown identifier type: {row[IDENTIFIER_TYPE]}")

    df[DOI] = doi
    df[URI] = uri
    df.drop(IDENTIFIER_INFO, inplace=True, axis=1)


def harvest_authors_names(df: DataFrame) -> None:
    """Harvest creators from interoperability guideline"""

    def rename_creators(creators: df) -> df:
        """Rename creators properties"""
        if creators is None:
            return None

        for creator in creators:
            if creator.get("creatorNameTypeInfo"):
                creator["author_name_type_info"] = creator.pop("creatorNameTypeInfo")
                if "creatorName" in creator["author_name_type_info"]:
                    creator["author_name_type_info"]["author_names"] = creator[
                        "author_name_type_info"
                    ].pop("creatorName")
                if "nameType" in creator["author_name_type_info"]:
                    creator["author_name_type_info"]["author_types"] = creator[
                        "author_name_type_info"
                    ].pop("nameType")

            if "givenName" in creator:
                creator["author_given_names"] = creator.pop("givenName")

            if "familyName" in creator:
                creator["author_family_names"] = creator.pop("familyName")

            if "nameIdentifier" in creator:
                creator["author_names_id"] = creator.pop("nameIdentifier")

            if creator.get("creatorAffiliationInfo"):
                creator["author_affiliation_info"] = creator.pop(
                    "creatorAffiliationInfo"
                )
                if "affiliation" in creator["author_affiliation_info"]:
                    creator["author_affiliation_info"]["author_affiliations"] = creator[
                        "author_affiliation_info"
                    ].pop("affiliation")
                if "affiliationIdentifier" in creator["author_affiliation_info"]:
                    creator["author_affiliation_info"]["author_affiliations_id"] = (
                        creator["author_affiliation_info"].pop("affiliationIdentifier")
                    )

        return creators

    def replace_empty_str(attr: str) -> [str, None]:
        """Replace empty string with None"""
        if not attr:
            return None
        return attr

    column = df[CREATORS]
    auth_col = []
    auth_typ_col = []
    given_name_col = []
    family_name_col = []
    name_id_col = []
    affiliation_col = []
    affiliation_id_col = []

    for authors in column:
        auth_row = []
        auth_typ_row = []
        given_name_row = []
        family_name_row = []
        name_id_row = []
        affiliation_row = []
        affiliation_id_row = []

        for author in authors:
            try:
                auth_name = replace_empty_str(
                    author["creatorNameTypeInfo"]["creatorName"]
                )
                auth_typ = replace_empty_str(author["creatorNameTypeInfo"]["nameType"])
            except TypeError:
                auth_name = None
                auth_typ = None
            auth_given_name = replace_empty_str(author["givenName"])
            auth_family_name = replace_empty_str(author["familyName"])
            auth_name_id = replace_empty_str(author["nameIdentifier"])
            try:
                auth_aff = replace_empty_str(
                    author["creatorAffiliationInfo"]["affiliation"]
                )
                auth_aff_id = replace_empty_str(
                    author["creatorAffiliationInfo"]["affiliationIdentifier"]
                )
            except TypeError:
                auth_aff = None
                auth_aff_id = None

            auth_row.append(auth_name)
            auth_typ_row.append(auth_typ)
            given_name_row.append(auth_given_name)
            family_name_row.append(auth_family_name)
            name_id_row.append(auth_name_id)
            affiliation_row.append(auth_aff)
            affiliation_id_row.append(auth_aff_id)

        auth_col.append(auth_row)
        auth_typ_col.append(auth_typ_row)
        given_name_col.append(given_name_row)
        family_name_col.append(family_name_row)
        name_id_col.append(name_id_row)
        affiliation_col.append(affiliation_row)
        affiliation_id_col.append(affiliation_id_row)

    df[AUTHOR_NAMES] = auth_col
    df[AUTHOR_NAMES_TG] = auth_col
    df[AUTHOR_TYPES] = auth_typ_col
    df[AUTHOR_GIVEN_NAMES] = given_name_col
    df[AUTHOR_FAMILY_NAMES] = family_name_col
    df[AUTHOR_NAMES_ID] = name_id_col
    df[AUTHOR_AFFILIATIONS] = affiliation_col
    df[AUTHOR_AFFILIATIONS_ID] = affiliation_id_col

    df[CREATORS] = df[CREATORS].apply(rename_creators)
    # Serialize creators
    df[CREATORS] = df[CREATORS].apply(lambda x: json.dumps(x))


def map_str_to_arr(df: DataFrame, cols: list) -> None:
    """Map string columns to array columns"""
    for col in cols:
        df[col] = [[row] for row in df[col]]


def rename_cols(df: DataFrame) -> None:
    """Rename columns"""

    def mapping_dict() -> dict:
        return {
            "alternativeIdentifiers": "alternative_ids",
            "publicationYear": "publication_year",
            "catalogueId": "catalogues",
            "created": "publication_date",
            "updated": "updated_at",
            "eoscGuidelineType": "eosc_guideline_type",
            "eoscIntegrationOptions": "eosc_integration_options",
            "providerId": "providers",
        }

    df.rename(columns=mapping_dict(), inplace=True)


def harvest_type_info(df: DataFrame) -> None:
    """Harvest resourceTypesInfo"""
    column = df[RESOURCE_TYPE_INFO]
    type_info_col = []
    type_gen_col = []

    for row in column:
        type_info_row = []
        type_gen_row = []
        for type_ in row:
            type_info_row.append(type_["resourceType"])
            type_gen_row.append(type_["resourceTypeGeneral"])

        type_info_col.append(type_info_row)
        type_gen_col.append(type_gen_row)

    df[TYPE_INFO] = type_info_col
    df[TYPE_GENERAL] = type_gen_col
    df.drop(RESOURCE_TYPE_INFO, inplace=True, axis=1)


def harvest_related_standards(df: DataFrame) -> None:
    """Harvest relatedStandards"""
    column = df[RELATED_STANDARDS]
    related_standards_id_col = []
    related_standards_uri_col = []

    for row in column:
        related_standards_id_row = []
        related_standards_uri_row = []
        for st in row:
            related_standards_id_row.append(st["relatedStandardIdentifier"])
            related_standards_uri_row.append(st["relatedStandardURI"])

        related_standards_id_col.append(related_standards_id_row)
        related_standards_uri_col.append(related_standards_uri_row)

    df[RELATED_STANDARDS_ID] = related_standards_id_col
    df[RELATED_STANDARDS_URI] = related_standards_uri_col
    df.drop(RELATED_STANDARDS, inplace=True, axis=1)


def ts_to_iso(df: DataFrame, cols: list[str]) -> None:
    """Reformat certain columns from unix ts into iso format
    timestamp is provided with millisecond-precision -> 13digits"""
    for col in cols:
        date_col = [
            datetime.utcfromtimestamp(int(row) / 1000).isoformat(timespec="seconds")
            for row in df[col]
        ]
        df[col] = date_col


def harvest_rights(df: DataFrame) -> None:
    """Harvest rights"""
    column = df[RIGHTS]
    right_title_col = []
    right_uri_col = []
    right_id_col = []

    for rights in column:
        right_title_row = []
        right_uri_row = []
        right_id_row = []

        for right in rights:
            right_title_row.append(right[RIGHT_TITLE_RAW])
            right_uri_row.append(right[RIGHT_URI_RAW])
            right_id_row.append(right[RIGHT_ID_RAW])

        right_title_col.append(right_title_row)
        right_uri_col.append(right_uri_row)
        right_id_col.append(right_id_row)

    df[RIGHT_TITLE] = right_title_col
    df[RIGHT_URI] = right_uri_col
    df[RIGHT_ID] = right_id_col
    df.drop(RIGHTS, inplace=True, axis=1)


def serialize_alternative_ids(df: DataFrame) -> None:
    """Serialize alternative_ids"""
    column = df[ALTERNATIVE_IDS]
    df[ALTERNATIVE_IDS] = [json.dumps(alter_ids) for alter_ids in column]


def map_providers(df: DataFrame) -> None:
    """Map pids into names - providers column"""
    providers_mapping = get_providers_mapping()
    df["providers"] = df["providers"].replace(providers_mapping)


def transform_guidelines(data: str) -> DataFrame:
    """Transform guidelines"""
    df = pd.DataFrame(data)

    try:  # validate input schema
        validate_pd_schema(df, guideline_input_schema, settings.GUIDELINE, "input")
    except AssertionError:
        logger.warning(
            f"Schema validation of raw input data for type={settings.GUIDELINE} has failed. Input schema is different than excepted"
        )

    df[TYPE] = settings.GUIDELINE
    rename_cols(df)
    df["catalogue"] = df["catalogues"].copy()  # TODO delete
    map_providers(df)
    df["provider"] = df["providers"].copy()  # TODO delete
    map_str_to_arr(df, ["title", "description", "catalogues", "providers"])
    ts_to_iso(df, ["publication_date", "updated_at"])

    if ALTERNATIVE_IDS in df.columns:
        serialize_alternative_ids(df)
    else:
        del guideline_output_schema[ALTERNATIVE_IDS]

    harvest_identifiers(df)
    harvest_authors_names(df)
    harvest_type_info(df)
    harvest_related_standards(df)
    harvest_rights(df)
    df = df.reindex(sorted(df.columns), axis=1)

    try:  # validate output schema
        validate_pd_schema(df, guideline_output_schema, settings.GUIDELINE, "output")
    except AssertionError:
        logger.warning(
            f"Schema validation after transformation failed for type={settings.GUIDELINE} has failed. Output schema is different than excepted"
        )

    columns_to_get = [
        _col for _col in guideline_output_schema.keys() if _col in df.columns
    ]
    # Take only those columns that are present in the expected output schema and exists in df
    df = df[columns_to_get]

    return df
