# pylint: disable=line-too-long, invalid-name, logging-fstring-interpolation, fixme
"""Transform interoperability guidelines"""
import logging
import copy
from datetime import datetime

import pandas as pd
from pandas import DataFrame
from transform.schemas.properties_name import DOI, AUTHOR_NAMES, AUTHOR_NAMES_TG, TYPE

logger = logging.getLogger(__name__)

IDENTIFIER_INFO = "identifierInfo"
IDENTIFIER = "identifier"
IDENTIFIER_TYPE = "identifierType"
IDENTIFIER_TYPE_DOI = "ir_identifier_type-doi"
RESOURCE_TYPE_INFO = "resourceTypesInfo"
RESOURCE_TYPE = "resourceType"

CREATORS = "creators"
CREATOR_NAME_TYPE_INFO = "creatorNameTypeInfo"
CREATOR_NAME = "creatorName"
CREATOR_NAME_TYPE = "nameType"
AUTHOR_TYPES = "author_types"
TYPE_INFO = "type_info"
RIGHTS = "rights"
RIGHT_TITLE_RAW = "rightTitle"
RIGHT_URI_RAW = "rightURI"
RIGHT_ID_RAW = "rightIdentifier"
RIGHT_TITLE = "right_title"
RIGHT_URI = "right_uri"
RIGHT_ID = "right_id"


def harvest_doi(df: DataFrame) -> None:
    """Harvest DOI from identifierInfo of interoperability guideline"""
    column = df[IDENTIFIER_INFO]
    doi = []
    for row in column:
        if row[IDENTIFIER_TYPE] == IDENTIFIER_TYPE_DOI:
            # if there is no DOI, the value is set to "missingDOI"
            if row[IDENTIFIER] != "missingDOI":
                doi.append([row[IDENTIFIER]])
            else:
                doi.append(None)
        else:
            doi.append(None)
            logger.warning(f"Unknown {IDENTIFIER_TYPE=}")

    df[DOI] = doi
    df.drop(IDENTIFIER_INFO, inplace=True, axis=1)


def harvest_authors_names(df: DataFrame) -> None:
    """Harvest authors_names and author_types from creators of interoperability guideline"""

    def expected_dict() -> dict:
        """Return the expected empty dict"""
        return {
            "givenName": "",
            "familyName": "",
            "nameIdentifier": "",
            "creatorAffiliationInfo": {"affiliation": "", "affiliationIdentifier": ""},
        }

    def validate(d: dict) -> None:
        """Successful validation criteria:
        - data is expected only in creatorNameTypeInfo.creatorName and creatorNameTypeInfo.nameType"""
        temp = copy.deepcopy(d)
        del temp[CREATOR_NAME_TYPE_INFO]
        if temp != expected_dict():
            logger.warning("Creators column includes more data")

    def replace_empty_str(attr: str) -> [str, None]:
        """Replace empty string with None"""
        if not attr:
            return None
        return attr

    column = df[CREATORS]
    auth_col = []
    auth_typ_col = []

    for authors in column:
        auth_row = []
        auth_typ_row = []
        for author in authors:
            validate(author)
            auth = replace_empty_str(author[CREATOR_NAME_TYPE_INFO][CREATOR_NAME])
            auth_typ = replace_empty_str(
                author[CREATOR_NAME_TYPE_INFO][CREATOR_NAME_TYPE]
            )
            auth_row.append(auth)
            auth_typ_row.append(auth_typ)

        auth_col.append(auth_row)
        auth_typ_col.append(auth_typ_row)

    df[AUTHOR_NAMES] = auth_col
    df[AUTHOR_NAMES_TG] = auth_col
    df[AUTHOR_TYPES] = auth_typ_col
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
            "created": "publication_date",
            "updated": "updated_at",
            "eoscRelatedStandards": "eosc_related_standards",
            "eoscGuidelineType": "eosc_guideline_type",
            "eoscIntegrationOptions": "eosc_integration_options",
        }

    df.rename(columns=mapping_dict(), inplace=True)


def harvest_type_info(df: DataFrame) -> None:
    """Harvest type_info from RESOURCE_TYPE_INFO"""
    column = df[RESOURCE_TYPE_INFO]
    type_info_col = [[types[RESOURCE_TYPE] for types in row] for row in column]

    df[TYPE_INFO] = type_info_col
    df.drop(RESOURCE_TYPE_INFO, inplace=True, axis=1)


def ts_to_iso(df: DataFrame, cols: list[str]) -> None:
    """Reformat certain columns from unix ts into iso format
    timestamp is provided with millisecond-precision -> 13digits"""
    for col in cols:
        date_col = [
            datetime.utcfromtimestamp(int(row) / 1000).isoformat(timespec="seconds")
            for row in df[col]
        ]
        df[col] = date_col


def harvest_rights(df: DataFrame) -> None:  # TODO refactor
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


def add_empty_cols_pd(df: DataFrame, cols: tuple) -> None:
    """Add empty columns to pandas dataframe"""
    for col in cols:
        df[col] = None


def cols_to_add() -> tuple:
    """Columns to add"""
    return (
        "abbreviation",
        "access_modes",
        "access_policies_url",
        "access_types",
        "activate_message",
        "author_pids",
        "best_access_right",
        "catalogue",
        "categories",
        "certifications",
        "changelog",
        "code_repository_url",
        "contactgroup",
        "contactperson",
        "content_type",
        "country",
        "datasource_classification",
        "dedicated_for",
        "document_type",
        "documentation_url",
        "duration",
        "eosc_provider",
        "format",
        "fos",
        "funder",
        "funding_bodies",
        "funding_programs",
        "geographical_availabilities",
        "grant_project_names",
        "helpdesk_email",
        "helpdesk_url",
        "horizontal",
        "jurisdiction",
        "keywords",
        "keywords_tg",
        "langauge",
        "language",
        "last_update",
        "level_of_expertise",
        "license",
        "life_cycle_status",
        "link_research_product_metadata_license_urls",
        "maintenance_url",
        "manual_url",
        "multimedia_urls",
        "offers_count",
        "open_access",
        "open_source_technologies",
        "order_url",
        "payment_model_url",
        "persistent_identity_systems_entity_type",
        "persistent_identity_systems_entity_type_schemes",
        "phase",
        "pid",
        "platforms",
        "preservation_policy_url",
        "pricing_url",
        "privacy_policy_url",
        "programming_language",
        "project_items_count",
        "providers",
        "publisher",
        "qualification",
        "rating",
        "related_platforms",
        "relations",
        "relations_long",
        "research_community",
        "research_entity_types",
        "research_product_access_policies",
        "research_product_licensing_urls",
        "research_product_metadata_access_policies",
        "resource_geographic_locations",
        "resource_level_url",
        "resource_organisation",
        "resource_type",
        "restrictions",
        "scientific_domains",
        "sdg",
        "security_contact_email",
        "service_opinion_count",
        "size",
        "sla_url",
        "slug",
        "source",
        "standards",
        "status_monitoring_url",
        "submission_policy_url",
        "subtitle",
        "synchronized_at",
        "tag_list",
        "tag_list_tg",
        "tagline",
        "target_group",
        "terms_of_use_url",
        "thematic",
        "tool",
        "training_information_url",
        "trl",
        "unified_categories",
        "upstream_id",
        "url",
        "usage_counts_downloads",
        "usage_counts_views",
        "use_cases_urls",
        "version",
        "version_control",
        "webpage_url",
    )


def transform_guidelines(df: str) -> DataFrame:
    """Transform guidelines"""
    df = pd.DataFrame(df)

    df[TYPE] = "interoperability guideline"
    rename_cols(df)
    map_str_to_arr(df, ["title", "description"])
    ts_to_iso(df, ["publication_date", "updated_at"])

    harvest_doi(df)
    harvest_authors_names(df)
    harvest_type_info(df)
    harvest_rights(df)

    df = pd.concat([df, pd.DataFrame(columns=list(cols_to_add()))])

    return df.reindex(sorted(df.columns), axis=1)
