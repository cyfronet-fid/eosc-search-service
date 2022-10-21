# pylint: disable=line-too-long, invalid-name, too-many-nested-blocks, unnecessary-dunder-call, too-many-branches
"""Common dataframes transformations"""
from typing import Dict, Sequence, List
from pyspark.sql import DataFrame
from pyspark.sql.functions import col, to_date, split
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
)

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
        (row[TYPE] == desired_type for row in df_type)
    ), f"Not all records have {TYPE}: {desired_type}"


def harvest_sdg_and_fos(
    df: DataFrame, harvested_properties: Dict, prop_to_harvest: Sequence
) -> None:
    """Harvest sdg and fos from subjects"""
    subjects = df.select("subject").collect()

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


def harvest_best_access_right(
    df: DataFrame, harvested_properties: Dict, col_name: str
) -> DataFrame:
    """Harvest best_access_right and map standardize its value"""
    if col_name.lower() in {"dataset", "publication", "software"}:
        df = df.withColumn(BEST_ACCESS_RIGHT, col(BEST_ACCESS_RIGHT)["label"])

    # Values are mapped to the keys
    mapping = {
        _OPEN_ACCESS: (
            "OPEN",
            "open_access",
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
    best_access_right = df.select(BEST_ACCESS_RIGHT).collect()
    best_access_right_column = []

    for access in best_access_right:
        if not access[BEST_ACCESS_RIGHT]:
            best_access_right_column.append(None)
            continue

        for desired_access_t, access_t in mapping.items():
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


def simplify_language(df: DataFrame) -> DataFrame:
    """Simplify language - get only label and convert structure to a string"""
    return df.withColumn("language", col("language")["label"])


def create_open_access(best_access_right: List, harvested_properties: Dict) -> None:
    """Create boolean value whether record is open access or not, based on col_name"""
    open_access_column = [bool(access == _OPEN_ACCESS) for access in best_access_right]

    harvested_properties[OPEN_ACCESS] = open_access_column


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
        .withColumnRenamed("codeRepositoryUrl", "code_repository_url")
        .withColumnRenamed("documentationUrl", "documentation_url")
        .withColumnRenamed("programmingLanguage", "programming_language")
        .withColumnRenamed("publicationdate", "publication_date")
        .withColumnRenamed("maintitle", "title")
    )

    return df


def cast_oag_columns(df: DataFrame) -> DataFrame:
    """Cast certain OAG columns"""
    df = df.withColumn("language", split(col("language"), ","))
    df = transform_date(df, "publication_date", "yyyy-MM-dd")

    return df
