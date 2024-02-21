"""Module for helper utilities for solr operations module"""

from datetime import date, timedelta

STATUS_TO_DATE_RANGE_MAP = {
    '("ongoing")': "{{!field f=date_range op=Contains}}[{today} TO {today}]",
    '("closed")': "{{!field f=date_range op=Within}}[* TO {yesterday}]",
    '("ongoing" OR "closed")': "{{!field f=date_range}}[* TO {today}]",
    '("closed" OR "ongoing")': "{{!field f=date_range}}[* TO {today}]",
    # "scheduled": "{{!field f=date_range op=Within}}[{tomorrow} TO *]",
}

TYPE_TO_FIELD_MAP = {
    "software": "related_software_ids",
    "publication": "related_publication_ids",
    "dataset": "related_dataset_ids",
    "other": "related_other_ids",
}


def parse_providers_filters(fq):
    """
    Function changing fq form AND to OR
    """
    valid_providers_fields = ["providers", "resource_organisation"]
    providers_fq = [item for item in fq if item.split(":")[0] in valid_providers_fields]
    other_fq = [item for item in fq if item.split(":")[0] not in valid_providers_fields]
    other_fq.append(" OR ".join(providers_fq))
    return other_fq


def parse_project_filters(fq):
    """
    Function creating proper 'status' filter basing on 'date_range' solr field
    """
    today = date.today()
    yesterday = date.today() - timedelta(days=1)
    tomorrow = date.today() + timedelta(days=1)
    key_to_parse = "project_status"
    regular_fq = [item for item in fq if item.split(":")[0] != key_to_parse]
    status_fq = [item for item in fq if item.split(":")[0] == key_to_parse]
    if not status_fq:
        return fq
    _, value = status_fq[0].split(":")
    regular_fq.append(
        STATUS_TO_DATE_RANGE_MAP[value].format(
            today=today, tomorrow=tomorrow, yesterday=yesterday
        )
    )

    return regular_fq


def parse_organisation_filters(fq):
    """
    Function creating a separate fq item for each of provided related_resource and maps it
    to existing solr fields
    """
    key_to_parse = "related_resources"
    regular_fq = [item for item in fq if item.split(":")[0] != key_to_parse]
    related_resource_type_fq = [
        item for item in fq if item.split(":")[0] == key_to_parse
    ]
    if not related_resource_type_fq:
        return fq
    _, values = related_resource_type_fq[0].split(":")
    parsed_values = [
        value.strip().replace('"', "") for value in values[1:-1].split("OR")
    ]
    regular_fq.append(
        " OR ".join([f"{TYPE_TO_FIELD_MAP[val]}:(*)" for val in parsed_values])
    )

    return regular_fq
