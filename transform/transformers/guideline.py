# pylint: disable=line-too-long, invalid-name, logging-fstring-interpolation, too-many-locals, fixme
"""Transform interoperability guidelines"""
import logging
from datetime import datetime

import pandas as pd
from pandas import DataFrame
from transform.schemas.properties_name import (
    DOI,
    URI,
    AUTHOR_NAMES,
    AUTHOR_NAMES_TG,
    TYPE,
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
                uri.append(None)
            case "ir_identifier_type-uri":
                doi.append(None)
                uri.append([row[IDENTIFIER]])
            case _:
                doi.append(None)
                uri.append(None)
                logger.warning(f"Unknown identifier type: {row[IDENTIFIER_TYPE]}")

    df[DOI] = doi
    df[URI] = uri
    df.drop(IDENTIFIER_INFO, inplace=True, axis=1)


def harvest_authors_names(df: DataFrame) -> None:
    """Harvest creators from interoperability guideline"""

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
            auth_name = replace_empty_str(author["creatorNameTypeInfo"]["creatorName"])
            auth_typ = replace_empty_str(author["creatorNameTypeInfo"]["nameType"])
            auth_given_name = replace_empty_str(author["givenName"])
            auth_family_name = replace_empty_str(author["familyName"])
            auth_name_id = replace_empty_str(author["nameIdentifier"])
            auth_aff = replace_empty_str(
                author["creatorAffiliationInfo"]["affiliation"]
            )
            auth_aff_id = replace_empty_str(
                author["creatorAffiliationInfo"]["affiliationIdentifier"]
            )

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

    df.drop(CREATORS, inplace=True, axis=1)


def map_str_to_arr(df: DataFrame, cols: list) -> None:
    """Map string columns to array columns"""
    for col in cols:
        df[col] = [[row] for row in df[col]]


def rename_cols(df: DataFrame) -> None:
    """Rename columns"""

    def mapping_dict() -> dict:
        return {
            "publicationYear": "publication_year",
            "catalogueId": "catalogue",
            "created": "publication_date",
            "updated": "updated_at",
            "eoscGuidelineType": "eosc_guideline_type",
            "eoscIntegrationOptions": "eosc_integration_options",
            "providerId": "provider",
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


def transform_guidelines(df: str) -> DataFrame:
    """Transform guidelines"""
    df = pd.DataFrame(df)

    df[TYPE] = "interoperability guideline"
    rename_cols(df)
    map_str_to_arr(df, ["title", "description"])
    ts_to_iso(df, ["publication_date", "updated_at"])

    harvest_identifiers(df)
    harvest_authors_names(df)
    harvest_type_info(df)
    harvest_related_standards(df)
    harvest_rights(df)

    return df.reindex(sorted(df.columns), axis=1)
