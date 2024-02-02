"""Define properties name that are used multiple times"""
import os

from schemas.properties.env import (
    ALL_COLLECTION,
    ORGANISATION,
    PATH,
    PROJECT,
    PUBLICATION,
    DATASET,
    SOFTWARE,
    OTHER_RP,
    DATA_RELATIONS,
    RESULT_ORGANIZATION,
    RESULT_PROJECT,
    ORGANIZATION_PROJECT,
)
from utils.loader import load_env_vars

# TODO INPUT, OUTPUT, BOTH

ABBREVIATION = "abbreviation"
ACRONYM = "acronym"
AFFILIATION = "affiliation"
ALTERNATIVENAMES = "alternativenames"
ALTERNATIVE_NAMES = "alternative_names"
AUTHOR = "author"
AUTHOR_NAMES = "author_names"
AUTHOR_PIDS = "author_pids"
BEST_ACCESS_RIGHT = "best_access_right"
CALLIDENTIFIER = "callidentifier"
CODE = "code"
CONTENT_TYPE = "content_type"
CONTEXT = "context"
COUNTRY = "country"
CURRENCY = "currency"
DATA_SOURCE = "datasource_pids"
DATE_RANGE = "date_range"
DESCRIPTION = "description"
DOCUMENT_TYPE = "document_type"
DOI = "doi"
DOWNLOADS = "usage_counts_downloads"
ENDDATE = "enddate"
END_DATE = "end_date"
EOSC_IF = "eosc_if"
EOSC_IF_TG = "eosc_if_tg"
EOSC_SCORE = "eosc_score"
EXPORTATION = "exportation"
FOS = "fos"
FUNDER = "funder"
FUNDING = "funding"
FUNDING_STREAM = "funding_stream"
FUNDING_STREAM_TITLE = "funding_stream_title"
FUNDING_TITLE = "funding_title"
GEO_AV = "geographical_availabilities"
GRANTED = "granted"
H2020PROGRAMME = "h2020programme"
ID = "id"
INSTANCE = "instance"
JURISDICTION = "jurisdiction"
KEYWORDS = "keywords"
LANGUAGE = "language"
LEGALNAME = "legalname"
LEGALSHORTNAME = "legalshortname"
LVL_OF_EXPERTISE = "level_of_expertise"
NAME = "name"
OPEN_ACCESS = "open_access"
OPENACCESSMANDATEFORDATASET = "openaccessmandatefordataset"
OPEN_ACCESS_MANDATE_FOR_DATASET = "open_access_mandate_for_dataset"
OPENACCESSMANDATEFORPUBLICATIONS = "openaccessmandateforpublications"
OPEN_ACCESS_MANDATE_FOR_PUBLICATIONS = "open_access_mandate_for_publications"
PERSIST_ID_SYS = "persistent_identity_systems"
PERSIST_ID_SYS_ENTITY_TYPE = "persistent_identity_systems_entity_type"
PERSIST_ID_SYS_ENTITY_TYPE_SCHEMES = "persistent_identity_systems_entity_type_schemes"
PID = "pid"
PIDS = "pids"
POPULARITY = "popularity"
PROJECTS = "projects"
PUBLICATION_DATE = "publication_date"
PUBLISHER = "publisher"
RELATED_DATASET_IDS = "related_dataset_ids"
RELATED_ORGANISATION_TITLES = "related_organisation_titles"
RELATED_OTHER_IDS = "related_other_ids"
RELATED_PROJECT_IDS = "related_project_ids"
RELATED_PUBLICATION_IDS = "related_publication_ids"
RELATED_SOFTWARE_IDS = "related_software_ids"
RELATIONS = "relations"
RELATIONS_LONG = "relations_long"
RESEARCH_COMMUNITY = "research_community"
RESOURCE_TYPE = "resource_type"
SCIENTIFIC_DOMAINS = "scientific_domains"
SHORTNAME = "shortName"
SDG = "sdg"
STARTDATE = "startdate"
START_DATE = "start_date"
SUBJECT = "subject"
SUMMARY = "summary"
TAG_LIST = "tag_list"
TARGET_GROUP = "target_group"
TITLE = "title"
TOTAL_COST = "total_cost"
TOTALCOST = "totalcost"
TYPE = "type"
UNIFIED_CATEGORIES = "unified_categories"
URL = "url"
URI = "uri"
VIEWS = "usage_counts_views"
WEBSITEURL = "websiteurl"

# Text general
AUTHOR_NAMES_TG = "author_names_tg"
KEYWORDS_TG = "keywords_tg"
TAG_LIST_TG = "tag_list_tg"

# RELATIONS related properties
env_vars = load_env_vars()

# HELPER COLUM NAMES
DIRECTORY = "directory"
FILE = "file"
SOURCE = "source"
SOURCE_FILE_PATH = "source_file_path"
SOURCE_TYPE = "source_type"
TARGET = "target"
TARGET_FILE_PATH = "target_file_path"
TARGET_TYPE = "target_type"

# DICT KEYS
# TODO replace all DICT KEYS with pydantic settings
DATASET_KEY = "dataset"
ORGANIZATION_KEY = "organization"
OTHERRESEARCHPRODUCT_KEY = "otherresearchproduct"
PUBLICATION_KEY = "publication"
PROJECT_KEY = "project"
SOFTWARE_KEY = "software"

# AGGREGATED COLUMNS -> these columns are added to each other, so can not be tuples
SELECTED_COLUMNS = [ID]
ADDITIONAL_COLUMNS = [LEGALNAME]

# PARQUET FILES
COMBINED_PQ_FILE = "tmp/combined_data.parquet"
ORGANIZATION_PQ = "tmp/organization.parquet"
PROJECT_PQ = "tmp/project.parquet"

# DIRECTORIES
# TODO replace with setting
TMP_DIRECTORY = "tmp/"
MAIN_DATA_DIRECTORY = os.path.dirname(
    os.path.dirname(env_vars[ALL_COLLECTION][ORGANISATION][PATH])
)

# DIRECTORIES GROUPED
# TODO replace with setting
DIRECTORIES_WITH_ADDITIONAL_COLUMNS = (env_vars[ALL_COLLECTION][ORGANISATION][PATH],)
SINGLE_DIRECTORIES = (
    env_vars[ALL_COLLECTION][ORGANISATION][PATH],
    env_vars[ALL_COLLECTION][PROJECT][PATH],
)
DATA_DIRECTORIES = (
    env_vars[ALL_COLLECTION][ORGANISATION][PATH],
    env_vars[ALL_COLLECTION][PROJECT][PATH],
    env_vars[ALL_COLLECTION][PUBLICATION][PATH],
    env_vars[ALL_COLLECTION][DATASET][PATH],
    env_vars[ALL_COLLECTION][SOFTWARE][PATH],
    env_vars[ALL_COLLECTION][OTHER_RP][PATH],
)
RESULT_RELATION_DIRECTORIES = (
    env_vars[DATA_RELATIONS][RESULT_ORGANIZATION][PATH],
    env_vars[DATA_RELATIONS][RESULT_PROJECT][PATH],
)
ORGANIZATION_PROJECT_RELATION_DIRECTORIES = (
    env_vars[DATA_RELATIONS][ORGANIZATION_PROJECT][PATH],
)
