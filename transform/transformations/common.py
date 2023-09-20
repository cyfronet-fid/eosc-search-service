# pylint: disable=line-too-long, invalid-name, too-many-nested-blocks, unnecessary-dunder-call
# pylint: disable=too-many-branches, unsubscriptable-object
"""Common dataframes transformations"""
from collections import defaultdict
from itertools import chain
from logging import getLogger
import json
from pyspark.sql import DataFrame
from pyspark.sql.functions import col, to_date, when, lit, concat_ws
from pyspark.sql.utils import AnalysisException
from schemas.properties_name import (
    AUTHOR,
    AUTHOR_NAMES,
    AUTHOR_PIDS,
    BEST_ACCESS_RIGHT,
    COUNTRY,
    DOCUMENT_TYPE,
    FUNDER,
    EXPORTATION,
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
    SUBJECT,
    LANGUAGE,
    TAG_LIST_TG,
    TAG_LIST,
    KEYWORDS_TG,
    KEYWORDS,
    AUTHOR_NAMES_TG,
    PROJECTS,
    INSTANCE,
    CONTEXT,
    PID,
    RELATIONS,
    RELATIONS_LONG,
    EOSC_IF,
    PIDS,
    SCIENTIFIC_DOMAINS,
)
from schemas.mappings import (
    OPEN_ACCESS_,
    access_rights_mapping,
    ZENODO,
    FIGSHARE,
    publisher_mapping,
    unified_categories_mapping,
    language_mapping,
)
from mappings.scientific_domain import scientific_domains_mapping, mp_sd_structure
from utils.utils import extract_digits_and_trim

logger = getLogger(__name__)


def harvest_author_names_and_pids(df: DataFrame, harvested_properties: dict) -> None:
    """
    1) Retrieve AUTHOR_NAMES from author.element.fullname as arr[str]
    2) Retrieve AUTHOR_PIDS from author.element.pid as arr[dict[<author_name>: <pid>]]
    """
    authors_collection = df.select(AUTHOR).collect()
    authors_names_column = []
    authors_pids_column = []

    for authors_list in authors_collection:
        author_names_row = []
        author_pids_row = []
        for authors in authors_list:
            if authors:
                for author in authors:
                    # Fullname
                    author_names_row.append(author["fullname"].replace(",", ""))
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


def harvest_scientific_domains(df: DataFrame, harvested_properties: dict) -> None:
    """Harvest fos from subjects - OAG resources.
    Then, map it into MP's scientific_domains"""

    def map_scientific_domain(sd_raw: str, sd_list: list[str]) -> list[str] | None:
        """Map scientific domain"""
        try:
            sd_trimmed = extract_digits_and_trim(sd_raw)
            sd_mapped = scientific_domains_mapping[sd_trimmed]

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
            logger.warning(
                f"Unexpected scientific domain: {sd_raw}, trimmed version: {extract_digits_and_trim(sd_raw)}"
            )
            return [sd_raw]

    def count_scientific_domain(sd_list: list[str]) -> (defaultdict, defaultdict):
        """Count actual and expected numbers of parents in scientific domain row"""
        actual_p = defaultdict(int)
        expected_p = defaultdict(int)

        for sd in sd_list:
            if ">" not in sd:  # Parent
                if sd in mp_sd_structure.keys():  # It was successfully mapped
                    actual_p[sd] += 1
                else:  # Skip not mapped ones
                    continue
            else:  # Child
                for mp_parent, mp_children in mp_sd_structure.items():
                    if sd in mp_children:
                        expected_p[mp_parent] += 1

        return actual_p, expected_p

    def adjust_scientific_domain(
        sd_list: list[str], actual_p: defaultdict, expected_p: defaultdict
    ) -> None:
        """Adjust scientific domains. There is a need to apply the same logic as PC does.
        Unfortunately, we cannot enforce anything during onboarding process as they do,
        so we need to deal with any case here.
        PC's Assumptions:
        - scientific domains have 2 levels. Parent -> children depth only,
        - you can set only child scientific domain for your resource (parent only is not allowed),
        - if you set a scientific domain for your resource, you always add also its parent. Always (child, parent) pairs
        - sd children cannot be duplicated,
        - sd parents can be duplicated, and they are duplicated a lot!
        Abbreviations for rules:
         - number of the same parent strings -> p
         - number of children of the same parent -> ch
        Rules how to satisfy PC's assumptions in our cases:
            For each resource we need to check its every sd parent whether PC's assumptions are satisfied.
            Cases:
                1) p == ch -> do nothing (happy path),
                2) p > ch -> delete as many parents to the point where p == ch,
                3) ch > p -> add as many parents to the point where p == ch,
                4) p > 0, ch == 0 -> delete this parent string/strings, but add all his children + parent pairs.
                   In other words, when there are only parents without children, add all their (child, parent) pairs,
                   but keep p == ch satisfied - so delete those initial parent strings.
        """

        def remove_n_occurrences(lst: list[any], elem: any, n: int) -> None:
            """Remove n occurrences of certain element in a list"""
            count = 0
            while n > count and elem in lst:
                lst.remove(elem)
                count += 1

        def remove_all_occurrences(lst: list[any], elem: any) -> None:
            """Remove all occurrences of certain element in a list"""
            while elem in lst:
                lst.remove(elem)

        for exp_parent, exp_num_of_parents in expected_p.items():
            for act_parent, act_num_of_parents in actual_p.items():
                if exp_parent == act_parent:
                    if (
                        exp_num_of_parents == act_num_of_parents
                    ):  # Case 1) - happy path - no action needed.
                        break
                    elif (
                        act_num_of_parents > exp_num_of_parents
                    ):  # Case 2) - delete excessive parents
                        difference = act_num_of_parents - exp_num_of_parents
                        remove_n_occurrences(sd_list, exp_parent, difference)
                        actual_p[act_parent] -= difference
                        break
                    elif (
                        act_num_of_parents < exp_num_of_parents
                    ):  # Case 3) - add additional parents
                        difference = exp_num_of_parents - act_num_of_parents
                        sd_list.extend([exp_parent] * difference)
                        actual_p[act_parent] += difference
                        break
            else:
                # Parent exists in expected data, but does not exist in an actual data
                sd_list.extend([exp_parent] * exp_num_of_parents)
                actual_p[exp_parent] += exp_num_of_parents

        # Case 4) - if there are more parents in actual data than expected
        if len(actual_p.keys()) != len(expected_p.keys()):
            difference = set(actual_p.keys()) ^ set(expected_p.keys())
            for parent in difference:
                # Delete all occurrences of that parent from scientific domain row
                remove_all_occurrences(sd_list, parent)
                # Add all its children + the parent itself as a pairs
                for child in mp_sd_structure[parent]:
                    sd_list.extend([child, parent])

                actual_p[parent] = len(mp_sd_structure[parent])
                expected_p[parent] = len(mp_sd_structure[parent])

    def check_mapping() -> None:
        """Check the accuracy of mapping"""
        (
            final_actual_parents_ctx,
            final_expected_parents_ctx,
        ) = count_scientific_domain(sd_row)
        if not (
            final_actual_parents_ctx == actual_parents_ctx
            and final_expected_parents_ctx == expected_parents_ctx
        ):
            error_stats = {
                "Final row": sd_row,
                "Actual from process": actual_parents_ctx,
                "Actual from check": final_actual_parents_ctx,
                "Expected from process": expected_parents_ctx,
                "Expected from check": final_expected_parents_ctx,
            }
            raise AssertionError(
                f"The mapping of scientific domains for a ceratin resource was not completely successful. Some values may be missing or incorrect. See: {error_stats}"
            )

    try:
        subjects = df.select(SUBJECT).collect()
    except AnalysisException:
        harvested_properties[SCIENTIFIC_DOMAINS] = [None] * df.count()
        return

    scientific_domain_column = []
    for subject in subjects:
        try:
            sd_prop = subject[SUBJECT][FOS]
            sd_row = []
            if sd_prop:
                for value in sd_prop:
                    final_sd = map_scientific_domain(value["value"], sd_row)
                    if final_sd:
                        sd_row.extend(final_sd)

                actual_parents_ctx, expected_parents_ctx = count_scientific_domain(
                    sd_row
                )
                adjust_scientific_domain(
                    sd_row, actual_parents_ctx, expected_parents_ctx
                )
                scientific_domain_column.append(sd_row)
                check_mapping()

            else:
                scientific_domain_column.append([])
        except (TypeError, ValueError):
            scientific_domain_column.append([])

    harvested_properties[SCIENTIFIC_DOMAINS] = scientific_domain_column


def harvest_sdg(df: DataFrame, harvested_properties: dict) -> None:
    """Harvest sdg from subjects - OAG resources"""
    try:
        subjects = df.select(SUBJECT).collect()
    except AnalysisException:
        harvested_properties[SDG] = [None] * df.count()
        return

    sdg_column = []
    for subject in subjects:
        try:
            sdg_prop = subject[SUBJECT][SDG]
            sdg_row = []
            if sdg_prop:
                for value in sdg_prop:
                    sdg_row.append(value["value"])
                sdg_column.append(sdg_row)
            else:
                sdg_column.append([])
        except (TypeError, ValueError):
            sdg_column.append([])

        harvested_properties[SDG] = sdg_column


def map_best_access_right(
    df: DataFrame, harvested_properties: dict, col_name: str
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


def create_open_access(harvested_properties: dict) -> None:
    """Create boolean value whether record is open access or not, based on col_name"""
    open_access_column = [
        bool(access == OPEN_ACCESS_)
        for access in harvested_properties[BEST_ACCESS_RIGHT]
    ]

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


def map_language(df: DataFrame, harvested_properties: dict) -> DataFrame:
    """Harvest language and standardize its value"""

    def transform_langs(langs: list) -> list:
        """Transform languages"""
        language_column = []
        for language in langs:
            language = language[LANGUAGE]
            if not language:
                language_column.append(None)
                continue

            lang_iterator(language, language_column)

        return language_column

    def lang_iterator(lang: str | list, _col: list) -> None:
        """Iterate over languages based on the type"""
        if isinstance(lang, list):
            list_lang_map(lang, _col)
        elif isinstance(lang, str):
            str_lang_map(lang, _col)
        else:
            raise TypeError(f"{lang} is not a type of a list or str")

    def list_lang_map(lang: list[str], _col: list) -> None:
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

    def str_lang_map(lang: str, _col: list) -> None:
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


def harvest_funder(df: DataFrame, harvested_properties: dict) -> None:
    """Harvest funder -> name and fundingStream as arr(arr(arr(fundingStream, <value>), arr(name, <value>>)))"""
    projects_list = df.select(PROJECTS).collect()
    funder_column = []

    for projects in projects_list:
        if projects[PROJECTS]:
            funder_list = []
            for project in projects[PROJECTS]:
                try:
                    funder = [
                        f"[{project[FUNDER]['fundingStream']}] {project[FUNDER]['name']}"
                    ]
                    funder_list.extend(funder)
                except TypeError:
                    funder_list.append([])
            funder_column.append(funder_list)
        else:
            funder_column.append([])

    harvested_properties[FUNDER] = funder_column


def harvest_url_and_document_type(df: DataFrame, harvested_properties: dict) -> None:
    """
    Harvest url from instance.element.url as array(str)

    Assumption:
    - url has to be unique for specific record, and it has to be a link
    """
    instances_list = df.select(INSTANCE).collect()
    url_column = []
    document_type_column = []

    for instances in instances_list:
        if instances[INSTANCE]:
            url_list = []
            document_type_list = []
            for instance in instances[INSTANCE]:
                if instance[URL]:
                    for url in instance[URL]:
                        if url and url not in url_list:
                            url_list.append(url)

                document_type_list.append(instance["type"])

            url_column.append(url_list)
            document_type_column.append(document_type_list)
        else:
            url_column.append([])

    harvested_properties[URL] = url_column
    harvested_properties[DOCUMENT_TYPE] = document_type_column


def harvest_country(df: DataFrame, harvested_properties: dict) -> None:
    """Harvest country from country.element.code as array(str)"""
    countries_list = df.select(COUNTRY).collect()
    country_column = []

    for countries in countries_list:
        countries_raw_val = countries[COUNTRY] or []
        country_val = [country["code"] for country in countries_raw_val]
        country_column.append(country_val)

    harvested_properties[COUNTRY] = country_column


def harvest_research_community(df: DataFrame, harvested_properties: dict) -> None:
    """Harvest research_community as array(str)"""
    contexts_list = df.select(CONTEXT).collect()
    rc_column = []

    for contexts in contexts_list:
        contexts_raw_val = contexts[CONTEXT] or []
        contexts_val = [context["label"] for context in contexts_raw_val]
        rc_column.append(contexts_val)

    harvested_properties[RESEARCH_COMMUNITY] = rc_column


def extract_pids(pid_list):
    """
    Extract PID information from a list of PIDs and return it as a dictionary.

    Args:
        pid_list (list): List of PIDs.

    Returns:
        dict: Dictionary containing PID information categorized by scheme.
    """
    pids_row = {
        "arXiv": [],
        "doi": [],
        "handle": [],
        "pdb": [],
        "pmc": [],
        "pmid": [],
        "w3id": [],
    }

    for pid in pid_list:
        pids_row[pid["scheme"]].append(pid["value"])

    return pids_row


def harvest_pids(df: DataFrame, harvested_properties: dict) -> None:
    """Harvest DOI from OAG resources"""
    pids_raw_column = df.select(PID).collect()
    pids_column = []

    for pids_list in pids_raw_column:
        pids = pids_list[PID] or []
        pids_row = extract_pids(pids)
        pids_column.append(json.dumps(pids_row))

    harvested_properties[PIDS] = pids_column

    # Add only DOI for backwards compatibility
    # TODO delete me after switch to the latest pids
    doi_column = []

    for pids in pids_raw_column:
        pids_raw_val = pids[PID] or []
        doi_urls = [pid["value"] for pid in pids_raw_val if pid["scheme"] == DOI]
        doi_column.append(doi_urls)

    harvested_properties[DOI] = doi_column


def harvest_relations(df: DataFrame, harvested_properties: dict):
    """Harvest relations from OAG resources"""
    relations_collection = df.select(RELATIONS).collect()
    relations_short_col = []
    relations_long_col = []

    for relations in chain.from_iterable(relations_collection):
        targets_row = []
        all_row = []
        if relations:
            for relation in relations:
                target = relation["target"]
                relation_name = relation["reltype"]["name"]
                relation_type = relation["reltype"]["type"]

                targets_row.append(target)
                all_row.append([target, relation_name, relation_type])

        relations_short_col.append(targets_row)
        relations_long_col.append(all_row)

    harvested_properties[RELATIONS] = relations_short_col
    harvested_properties[RELATIONS_LONG] = relations_long_col


def harvest_eosc_if(df: DataFrame, harvested_properties: dict):
    """Harvest eoscIF from OAG resources"""
    eosc_if_collection = df.select("eoscIF").collect()
    eosc_if_col = []

    for eosc_if in chain.from_iterable(eosc_if_collection):
        if eosc_if:
            eosc_if_row = [elem["code"] for elem in eosc_if]
            eosc_if_col.append(eosc_if_row)
        else:
            eosc_if_col.append([])

    harvested_properties[EOSC_IF] = eosc_if_col


def transform_date(df: DataFrame, col_name: str, date_format: str) -> DataFrame:
    """Cast string date type to date type"""
    df = df.withColumn(
        col_name,
        to_date(df.__getattr__(col_name), date_format),
    )

    return df


def create_unified_categories(df: DataFrame, harvested_properties: dict) -> None:
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
    columns = df.columns

    if AUTHOR_NAMES in columns:
        df = df.withColumn(AUTHOR_NAMES_TG, col(AUTHOR_NAMES))
    if KEYWORDS in columns:
        df = df.withColumn(KEYWORDS_TG, col(KEYWORDS))
    if TAG_LIST in columns:
        df = df.withColumn(TAG_LIST_TG, col(TAG_LIST))

    return df


def harvest_exportation(df: DataFrame, harvested_properties: dict) -> None:
    """
    Harvest exportation information from instances within the DataFrame

    Args:
        df (DataFrame): Input DataFrame containing instance information.
        harvested_properties (dict): Dictionary to store harvested properties.

    Assumptions:
        - Only the first 10 versions of each instance are harvested; subsequent versions are skipped
          (approx. 0.2% of data is skipped).

    For each instance:
    - Extracted Fields:
        - URL: URL of the instance.
        - Type: Type of the instance.
        - Publication Year: Year of publication from the publication date.
        - License: License information.
        - PIDs: Persistent identifiers associated with the instance.
        - Hosted By: The entity hosting the instance.

    The extracted information is structured into a list of dictionaries for each instance and stored in
    'harvested_properties[EXPORTATION]'.

    Note:
    - 'instance_idx' is used to limit harvesting to the first 10 versions of each instance.

    """
    instances_list = df.select(INSTANCE).collect()
    exportation_column = []
    instances_limit = 10

    for instances in instances_list:
        if instances[INSTANCE]:
            exportation_row = []

            for instance_idx, instance in enumerate(instances[INSTANCE]):
                if instance_idx >= instances_limit:
                    break

                url = instance[URL] if instance[URL] else None
                exportation_type = instance["type"] if instance["type"] else None
                publication_year = (
                    instance["publicationdate"][0:4]
                    if instance["publicationdate"]
                    else None
                )
                instance_license = instance["license"] if instance["license"] else None

                pids = instance["pid"] or []
                pids_row = extract_pids(pids)

                datasource = (
                    instance["hostedby"]["value"] if instance["hostedby"] else None
                )

                exportation_instance = {
                    "url": url,
                    "document_type": exportation_type,
                    "publication_year": publication_year,
                    "license": instance_license,
                    "pids": pids_row,
                    "hostedby": datasource,
                }

                exportation_row.append(exportation_instance)

            exportation_column.append(exportation_row)
        else:
            exportation_column.append([])

    harvested_properties[EXPORTATION] = exportation_column


def remove_commas(
    df: DataFrame, col_name: str, harvested_properties: dict
) -> DataFrame:
    """Remove commas from a column values"""
    column_with_commas = df.select(col_name).collect()
    column_without_commas = [
        [elem.replace(",", "") for elem in row[col_name]] for row in column_with_commas
    ]

    harvested_properties[col_name] = column_without_commas

    return df.drop(col_name)
