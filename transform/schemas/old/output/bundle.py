# pylint: disable=duplicate-code
"""Bundles expected schema after transformations"""

bundle_output_schema = {
    "bundle_goals": "array<string>",
    "catalogue": "string",  # TODO delete
    "catalogues": "array<string>",
    "capabilities_of_goals": "array<string>",
    "contact_email": "string",
    "dedicated_for": "array<string>",
    "description": "string",
    "eosc_if": "array<string>",
    "eosc_if_tg": "array<string>",
    "helpdesk_url": "string",
    "id": "string",
    "iid": "bigint",
    "main_offer_id": "string",
    "offer_ids": "array<int>",
    "popularity": "int",
    "providers": "array<string>",
    "publication_date": "date",
    "related_training": "boolean",
    "resource_organisation": "string",
    "scientific_domains": "array<string>",
    "service_id": "bigint",
    "title": "string",
    "type": "string",
    "unified_categories": "array<string>",
    "updated_at": "date",
    "usage_counts_downloads": "bigint",
    "usage_counts_views": "bigint",
}
