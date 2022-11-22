# pylint: disable=line-too-long, invalid-name, too-many-nested-blocks, unnecessary-dunder-call, too-many-branches, unsubscriptable-object
"""Common dataframes transformations"""
from typing import Dict, Tuple, List, Union
from pyspark.sql import DataFrame
from pyspark.sql.functions import col, to_date, when, lit
from pyspark.sql.utils import AnalysisException
from transform.all_collection.spark.schemas.input_col_name import (
    AUTHOR_NAMES,
    AUTHOR_PIDS,
    BEST_ACCESS_RIGHT,
    COUNTRY,
    DOCUMENT_TYPE,
    FUNDER,
    OPEN_ACCESS,
    RESEARCH_COMMUNITY,
    TYPE,
    URL,
    DOI,
    PUBLISHER,
    FOS,
    SDG,
    UNIFIED_CATEGORIES,
    DOWNLOADS,
    VIEWS,
    LANGUAGE,
    TAG_LIST_TG,
    TAG_LIST,
    KEYWORDS_TG,
    KEYWORDS,
    AUTHOR_NAMES_TG,
)

# Mappings - values are mapped to the keys
# Access rights mapping
_OPEN_ACCESS = "Open access"
RESTRICTED = "Restricted"
ORDER_REQUIRED = "Ordered required"
LOGIN_REQUIRED = "Login required"
LOGIN_REQUIRED_ON = (
    "Login required on EOSC Pillar, open access on the original resource page"
)
CLOSED = "Closed"
EMBARGO = "Embargo"
OTHER = "Other"

access_rights_mapping = {
    _OPEN_ACCESS: (
        "OPEN",
        "open_access",
        "Open Access",
        "fully_open_access",
        "open access",
        "free access",
        "free access ",
    ),
    RESTRICTED: ("RESTRICTED",),
    ORDER_REQUIRED: ("order_required",),
    LOGIN_REQUIRED: ("login required",),
    LOGIN_REQUIRED_ON: (
        "login required on EOSC Pillar, open access on the original resource page",
    ),
    CLOSED: ("CLOSED",),
    EMBARGO: ("EMBARGO",),
    OTHER: ("other",),
}

# Publisher mapping
ZENODO = "Zenodo"
FIGSHARE = "Figshare"
publisher_mapping = {
    ZENODO: "ZENODO",
    FIGSHARE: "figshare",
}

# Unified categories mapping
OAG_UNI_CAT = "Discover Research Outputs"
TRAIN_UNI_CAT = "Access Training Material"

unified_categories_mapping = {
    OAG_UNI_CAT: ("dataset", "publication", "software", "other"),
    TRAIN_UNI_CAT: ("training",),
}

# Language mapping
NOT_SPECIFIED = "Not specified"
ENGLISH = "English"
SPANISH = "Spanish"

language_mapping = {
    NOT_SPECIFIED: (
        "undetermined",
        "unknown",
        "null",
    ),
    ENGLISH: "en",
    SPANISH: "es",
}


def harvest_author_names_and_pids(df: DataFrame, harvested_properties: Dict) -> None:
    """
    1) Retrieve AUTHOR_NAMES from author.element.fullname as arr[str]
    2) Retrieve AUTHOR_PIDS from author.element.pid as arr[dict[<author_name>: <pid>]]
    """
    authors_collection = df.select("author").collect()
    authors_names_column = []
    authors_pids_column = []

    for authors_list in authors_collection:
        author_names_row = []
        author_pids_row = []
        for authors in authors_list:
            if authors:
                for author in authors:
                    # Fullname
                    author_names_row.append(author["fullname"])
                    # Pids
                    if author["pid"]:
                        author_pid = [
                            [author["fullname"]],
                            author["pid"]["id"]["value"],
                        ]
                    else:
                        author_pid = [[author["fullname"]], []]
                    author_pids_row.append(author_pid)

            authors_names_column.append(author_names_row)
            authors_pids_column.append(author_pids_row)

    harvested_properties[AUTHOR_NAMES] = authors_names_column
    harvested_properties[AUTHOR_PIDS] = authors_pids_column


def check_type(df: DataFrame, desired_type: str) -> None:
    """Check if all records have the right type"""
    df_type = df.select(TYPE).collect()
    assert all(
        (row[TYPE].lower() == desired_type.lower() for row in df_type)
    ), f"Not all records have {TYPE}: {desired_type}"


def harvest_sdg_and_fos(
    df: DataFrame, harvested_properties: Dict, prop_to_harvest: Tuple = (FOS, SDG)
) -> None:
    """Harvest sdg and fos from subjects"""
    try:
        subjects = df.select("subject").collect()
    except AnalysisException:
        harvested_properties[FOS] = [None] * df.count()
        harvested_properties[SDG] = [None] * df.count()
        return

    for prop in prop_to_harvest:
        harvested_prop_column = []
        for subject in subjects:
            try:
                input_prop = subject["subject"][prop]
                prop_list = []
                if input_prop:
                    for value in input_prop:
                        prop_list.append(value["value"])
                    harvested_prop_column.append(prop_list)
                else:
                    harvested_prop_column.append([])
            except (TypeError, ValueError):
                harvested_prop_column.append([])

        harvested_properties[prop] = harvested_prop_column


def map_best_access_right(
    df: DataFrame, harvested_properties: Dict, col_name: str
) -> DataFrame:
    """Harvest best_access_right and map standardize its value"""
    if col_name.lower() in {"dataset", "publication", "software", "other"}:
        df = df.withColumn(BEST_ACCESS_RIGHT, col(BEST_ACCESS_RIGHT)["label"])

    best_access_right = df.select(BEST_ACCESS_RIGHT).collect()
    best_access_right_column = []

    for access in best_access_right:
        if not access[BEST_ACCESS_RIGHT]:
            best_access_right_column.append(None)
            continue

        for desired_access_t, access_t in access_rights_mapping.items():
            if access[BEST_ACCESS_RIGHT] in access_t:
                best_access_right_column.append(desired_access_t)
                break
        else:
            print(
                f"Warning unknown access right: best_access_right={access[BEST_ACCESS_RIGHT]}, collection={col_name}"
            )
            best_access_right_column.append(access[BEST_ACCESS_RIGHT])

    harvested_properties[BEST_ACCESS_RIGHT] = best_access_right_column
    return df.drop(BEST_ACCESS_RIGHT)


def create_open_access(best_access_right: List, harvested_properties: Dict) -> None:
    """Create boolean value whether record is open access or not, based on col_name"""
    open_access_column = [bool(access == _OPEN_ACCESS) for access in best_access_right]

    harvested_properties[OPEN_ACCESS] = open_access_column


def map_publisher(df: DataFrame) -> DataFrame:
    """Map publishers' value for OAG resources"""
    return df.withColumn(
        PUBLISHER,
        when(col(PUBLISHER) == publisher_mapping[ZENODO], ZENODO)
        .when(col(PUBLISHER) == publisher_mapping[FIGSHARE], FIGSHARE)
        .otherwise(col(PUBLISHER)),
    )


def simplify_language(df: DataFrame) -> DataFrame:
    """Simplify language - get only label and convert structure to a string"""
    return df.withColumn(LANGUAGE, col(LANGUAGE)["label"])


def map_language(df: DataFrame, harvested_properties: Dict) -> DataFrame:
    """Harvest language and standardize its value"""

    def transform_langs(langs: List) -> List:
        """Transform languages"""
        language_column = []
        for language in langs:
            language = language[LANGUAGE]
            if not language:
                language_column.append(None)
                continue

            lang_iterator(language, language_column)

        return language_column

    def lang_iterator(lang: Union[str, list], _col: List) -> None:
        """Iterate over languages based on the type"""
        if isinstance(lang, list):
            list_lang_map(lang, _col)
        elif isinstance(lang, str):
            str_lang_map(lang, _col)
        else:
            raise TypeError(f"{lang} is not a type of a list or str")

    def list_lang_map(lang: List[str], _col: List) -> None:
        """Iterator for list languages"""
        language_row = []
        for l in lang:
            for desired_lan, old_lang in language_mapping.items():
                if l in old_lang:
                    language_row.append(desired_lan)
                    break
            else:
                language_row.append(lang)
        _col.append(language_row)

    def str_lang_map(lang: str, _col: List) -> None:
        """Iterator for str languages"""
        for desired_lang, old_lang in language_mapping.items():
            if lang.lower() in old_lang:
                _col.append([desired_lang])
                break
        else:
            _col.append([lang])

    languages = df.select(LANGUAGE).collect()
    harvested_properties[LANGUAGE] = transform_langs(languages)

    return df.drop(LANGUAGE)


def harvest_funder(df: DataFrame, harvested_properties: Dict) -> None:
    """Harvest funder -> name and fundingStream as arr(arr(arr(fundingStream, <value>), arr(name, <value>>)))"""
    projects_list = df.select("projects").collect()
    funder_column = []

    for projects in projects_list:
        if projects["projects"]:
            funder_list = []
            for project in projects["projects"]:
                try:
                    funder = [
                        f"[{project['funder']['fundingStream']}] {project['funder']['name']}"
                    ]
                    funder_list.extend(funder)
                except TypeError:
                    funder_list.append([])
            funder_column.append(funder_list)
        else:
            funder_column.append([])

    harvested_properties[FUNDER] = funder_column


def harvest_url_and_document_type(df: DataFrame, harvested_properties: Dict) -> None:
    """
    Harvest url from instance.element.url as array(str)

    Assumption:
    - url has to be unique for specific record, and it has to be a link
    """
    instances_list = df.select("instance").collect()
    url_column = []
    document_type_column = []

    for instances in instances_list:
        if instances["instance"]:
            url_list = []
            document_type_list = []
            for instance in instances["instance"]:
                if instance["url"]:
                    for url in instance["url"]:
                        if url and url not in url_list:
                            url_list.append(url)

                document_type_list.append(instance["type"])

            url_column.append(url_list)
            document_type_column.append(document_type_list)
        else:
            url_column.append([])

    harvested_properties[URL] = url_column
    harvested_properties[DOCUMENT_TYPE] = document_type_column


def harvest_country(df: DataFrame, harvested_properties: Dict) -> None:
    """Harvest country from country.element.code as array(str)"""
    countries_list = df.select("country").collect()
    country_column = []

    for countries in countries_list:
        countries_raw_val = countries["country"] or []
        country_val = [country["code"] for country in countries_raw_val]
        country_column.append(country_val)

    harvested_properties[COUNTRY] = country_column


def harvest_research_community(df: DataFrame, harvested_properties: Dict) -> None:
    """Harvest research_community as array(str)"""
    contexts_list = df.select("context").collect()
    rc_column = []

    for contexts in contexts_list:
        contexts_raw_val = contexts["context"] or []
        contexts_val = [context["label"] for context in contexts_raw_val]
        rc_column.append(contexts_val)

    harvested_properties[RESEARCH_COMMUNITY] = rc_column


def harvest_doi(df: DataFrame, harvested_properties: Dict) -> None:
    """Harvest DOI from OAG resources"""
    pids_list = df.select("pid").collect()
    doi_column = []

    for pids in pids_list:
        pids_raw_val = pids["pid"] or []
        doi_urls = [pid["value"] for pid in pids_raw_val if pid["scheme"] == DOI]
        doi_column.append(doi_urls)

    harvested_properties[DOI] = doi_column


def transform_date(df: DataFrame, col_name: str, date_format: str) -> DataFrame:
    """Cast string date type to date type"""
    df = df.withColumn(
        col_name,
        to_date(df.__getattr__(col_name), date_format),
    )

    return df


def rename_oag_columns(df: DataFrame) -> DataFrame:
    """Rename certain OAG columns"""
    df = (
        df.withColumnRenamed("bestaccessright", "best_access_right")
        .withColumnRenamed("documentationUrl", "documentation_url")
        .withColumnRenamed("programmingLanguage", "programming_language")
        .withColumnRenamed("publicationdate", "publication_date")
        .withColumnRenamed("maintitle", "title")
    )

    return df


def cast_oag_columns(df: DataFrame) -> DataFrame:
    """Cast certain OAG columns"""
    df = transform_date(df, "publication_date", "yyyy-MM-dd")

    return df


def create_unified_categories(df: DataFrame, harvested_properties: Dict) -> None:
    """Create unified categories"""
    type_column = df.select(TYPE).collect()
    uni_cat_column = []

    for _type in type_column:
        for uni_cat, col_name in unified_categories_mapping.items():
            if _type[TYPE] in col_name:
                uni_cat_column.append([uni_cat])
                break
        else:
            uni_cat_column.append([])

    harvested_properties[UNIFIED_CATEGORIES] = uni_cat_column


def simplify_indicators(df: DataFrame) -> DataFrame:
    """Simplify indicators - retrieve downloads, views"""
    try:
        df = df.withColumn(
            DOWNLOADS,
            when(df.indicator.isNull(), None).otherwise(
                df.indicator["usageCounts"]["downloads"]
            ),
        ).withColumn(
            VIEWS,
            when(df.indicator.isNull(), None).otherwise(
                df.indicator["usageCounts"]["views"]
            ),
        )
    except (AnalysisException, AttributeError):
        df = df.withColumn(DOWNLOADS, lit(None)).withColumn(VIEWS, lit(None))

    return df


def add_tg_fields(df: DataFrame) -> DataFrame:
    """Add copy of certain fields for solr text_general
    strings - type used for filtering
    text_general - type used for searching"""
    df = (
        df.withColumn(AUTHOR_NAMES_TG, col(AUTHOR_NAMES))
        .withColumn(KEYWORDS_TG, col(KEYWORDS))
        .withColumn(TAG_LIST_TG, col(TAG_LIST))
    )

    return df
