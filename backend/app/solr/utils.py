"""Module for helper utilities for solr operations module"""


def parse_providers_filters(fq):
    """
    Function changing fq form AND to OR
    """
    valid_providers_fields = ["providers", "resource_organisation"]
    providers_fq = [item for item in fq if item.split(":")[0] in valid_providers_fields]
    other_fq = [item for item in fq if item.split(":")[0] not in valid_providers_fields]
    other_fq.append(" OR ".join(providers_fq))
    return other_fq
