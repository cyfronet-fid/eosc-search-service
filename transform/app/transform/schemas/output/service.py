# pylint: disable=duplicate-code
"""Service expected schema after transformations"""

service_output_schema = {
    "abbreviation": "string",
    "access_modes": "array<string>",
    "access_policies_url": "string",
    "access_types": "array<string>",
    "activate_message": "string",
    "best_access_right": "string",
    "catalogue": "string",  # TODO delete
    "catalogues": "array<string>",
    "categories": "array<string>",
    "certifications": "array<string>",
    "changelog": "array<string>",
    "dedicated_for": "array<string>",
    "description": "string",
    "eosc_if": "array<string>",
    "eosc_if_tg": "array<string>",
    "funding_bodies": "array<string>",
    "funding_programs": "array<string>",
    "guidelines": "array<string>",
    "geographical_availabilities": "array<string>",
    "grant_project_names": "array<string>",
    "helpdesk_email": "string",
    "helpdesk_url": "string",
    "horizontal": "boolean",
    "id": "string",
    "language": "array<string>",
    "last_update": "date",
    "life_cycle_status": "string",
    "maintenance_url": "string",
    "manual_url": "string",
    "multimedia_urls": "array<string>",
    "offers_count": "bigint",
    "open_access": "boolean",
    "open_source_technologies": "array<string>",
    "order_url": "string",
    "payment_model_url": "string",
    "phase": "string",
    "pid": "string",
    "platforms": "array<string>",
    "popularity": "int",
    "pricing_url": "string",
    "privacy_policy_url": "string",
    "providers": "array<string>",
    "publication_date": "date",
    "rating": "string",
    "related_platforms": "array<string>",
    "resource_geographic_locations": "array<string>",
    "resource_organisation": "string",
    "restrictions": "string",
    "scientific_domains": "array<string>",
    "security_contact_email": "string",
    "service_opinion_count": "bigint",
    "sla_url": "string",
    "slug": "string",
    "standards": "array<string>",
    "status": "string",
    "status_monitoring_url": "string",
    "synchronized_at": "date",
    "tag_list": "array<string>",
    "tag_list_tg": "array<string>",
    "tagline": "string",
    "terms_of_use_url": "string",
    "title": "string",
    "training_information_url": "string",
    "trl": "string",
    "type": "string",
    "unified_categories": "array<string>",
    "updated_at": "date",
    "upstream_id": "bigint",
    "usage_counts_downloads": "bigint",
    "usage_counts_views": "bigint",
    "use_cases_urls": "array<string>",
    "version": "string",
    "webpage_url": "string",
}
