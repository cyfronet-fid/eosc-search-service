# pylint: disable=duplicate-code
"""Bundles expected input schema"""

bundle_input_schema = {
    "bundle_goals": ["array<string>"],
    "catalogues": ["array<string>"],
    "capabilities_of_goals": ["array<string>"],
    "contact_email": ["string"],
    "description": ["string"],
    "eosc_if": ["array<string>"],
    "helpdesk_url": ["string"],
    "id": ["bigint"],
    "iid": ["bigint"],
    "main_offer_id": ["bigint"],
    "name": ["string"],
    "offer_ids": ["array<bigint>"],
    "providers": ["array<string>"],
    "publication_date": ["string"],
    "related_training": ["boolean"],
    "research_steps": ["array<string>"],
    "resource_organisation": ["string"],
    "scientific_domains": ["array<string>"],
    "service_id": ["bigint"],
    "tag_list": ["array<string>"],
    "target_users": ["array<string>"],
    "updated_at": ["string"],
    "usage_counts_downloads": ["bigint"],
    "usage_counts_views": ["bigint"],
}
