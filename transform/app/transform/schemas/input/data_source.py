# pylint: disable=duplicate-code
"""Data source expected input schema"""

data_source_input_schema = {
    "abbreviation": "string",
    "access_modes": "array<string>",
    "access_types": "array<string>",
    "catalogues": "array<string>",
    "categories": "array<string>",
    "certifications": "array<string>",
    "changelog": "array<string>",
    "datasource_classification": "string",
    "dedicated_for": "array<string>",
    "description": "string",
    "eosc_if": "array<string>",
    "funding_bodies": "array<string>",
    "funding_programs": "array<string>",
    "geographical_availabilities": "array<string>",
    "grant_project_names": "array<string>",
    "helpdesk_email": "string",
    "helpdesk_url": "string",
    "horizontal": "boolean",
    "id": "bigint",
    "jurisdiction": "string",
    "language_availability": "array<string>",
    "last_update": "string",
    "life_cycle_status": "string",
    "maintenance_url": "string",
    "manual_url": "string",
    "multimedia_urls": "array<struct<name:string,url:string>>",
    "name": "string",
    "open_source_technologies": "array<string>",
    "order_type": "string",
    "order_url": "string",
    "payment_model_url": "string",
    "persistent_identity_systems": "array<struct<entity_type:string,entity_type_schemes:array<string>>>",
    "pid": "string",
    "platforms": "array<string>",
    "preservation_policy_url": "string",
    "pricing_url": "string",
    "privacy_policy_url": "string",
    "providers": "array<string>",
    "public_contacts": "array<struct<contactable_id:bigint,contactable_type:string,created_at:string,email:string,first_name:string,id:bigint,last_name:string,organisation:string,phone:string,position:string,updated_at:string>>",
    "publication_date": "string",
    "research_entity_types": "array<string>",
    "research_product_access_policies": "array<string>",
    "research_product_licensing_urls": "array<struct<name:string,url:string>>",
    "research_product_metadata_access_policies": "array<string>",
    "research_product_metadata_license_urls": "array<struct<name:string,url:string>>",
    "resource_geographic_locations": "array<string>",
    "resource_level_url": "string",
    "resource_organisation": "string",
    "scientific_domains": "array<string>",
    "security_contact_email": "string",
    "standards": "array<string>",
    "status": "string",
    "status_monitoring_url": "string",
    "submission_policy_url": "string",
    "synchronized_at": "string",
    "tag_list": "array<string>",
    "tagline": "string",
    "terms_of_use_url": "string",
    "thematic": "boolean",
    "training_information_url": "string",
    "trl": "string",
    "unified_categories": "array<string>",
    "updated_at": "string",
    "upstream_id": "bigint",
    "usage_counts_downloads": "bigint",
    "usage_counts_views": "bigint",
    "use_cases_urls": "array<struct<name:string,url:string>>",
    "version": "string",
    "version_control": "boolean",
    "webpage_url": "string",
}
