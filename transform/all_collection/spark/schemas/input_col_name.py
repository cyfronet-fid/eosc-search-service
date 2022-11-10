"""Define columns name"""

# OAG
AUTHOR_NAMES = "author_names"
AUTHOR_PIDS = "author_pids"
BEST_ACCESS_RIGHT = "best_access_right"
COUNTRY = "country"
DESCRIPTION = "description"
DURATION = "duration"
DOCUMENT_TYPE = "document_type"
FOS = "fos"
FUNDER = "funder"
ID = "id"
KEYWORDS = "keywords"
LANGUAGE = "language"
OPEN_ACCESS = "open_access"
PUBLISHED = "published"
PUBLISHER = "publisher"
RESEARCH_COMMUNITY = "research_community"
SDG = "sdg"
SOURCE = "source"
SUBJECTS = "subjects"
TITLE = "title"
TYPE = "type"
URL = "url"
DOI = "doi"
UNIFIED_CATEGORIES = "unified_categories"
DOWNLOADS = "usage_counts_downloads"
VIEWS = "usage_counts_views"

# Training
FORMAT = "format"

# Service
GEO_AV = "geographical_availabilities"
RESOURCE_GEO_LOC = "resource_geographic_locations"


UNIQUE_SERVICE_COLUMNS = (
    "abbreviation",
    "access_modes",
    "access_policies_url",
    "access_types",
    "activate_message",
    "catalogue",
    "categories",
    "certifications",
    "changelog",
    "dedicated_for",
    "funding_bodies",
    "funding_programs",
    "geographical_availabilities",
    "grant_project_names",
    "helpdesk_email",
    "helpdesk_url",
    "last_update",
    "life_cycle_status",
    "maintenance_url",
    "manual_url",
    "multimedia_urls",
    "offers_count",
    "open_source_technologies",
    "order_url",
    "payment_model_url",
    "phase",
    "platforms",
    "pricing_url",
    "privacy_policy_url",
    "project_items_count",
    "providers",
    "rating",
    "related_platforms",
    "resource_geographic_locations",
    "resource_organisation",
    "restrictions",
    "scientific_domains",
    "security_contact_email",
    "service_opinion_count",
    "sla_url",
    "slug",
    "standards",
    "status",
    "status_monitoring_url",
    "synchronized_at",
    "tag_list",
    "tagline",
    "terms_of_use_url",
    "training_information_url",
    "trl",
    "updated_at",
    "upstream_id",
    "use_cases_urls",
    "webpage_url",
)

UNIQUE_OAG_AND_TRAINING_COLS = (
    "author_names",
    "author_pids",
    "contactgroup",
    "contactperson",
    "content_type",
    "country",
    "document_type",
    "documentation_url",
    "doi",
    "duration",
    "eosc_provider",
    "format",
    "fos",
    "funder",
    "keywords",
    "level_of_expertise",
    "license",
    "programming_language",
    "publisher",
    "qualification",
    "research_community",
    "resource_type",
    "sdg",
    "size",
    "source",
    "subtitle",
    "target_group",
    "tool",
    "url",
    "usage_counts_downloads",
    "usage_counts_views",
)

UNIQUE_SERVICE_COLS_FOR_DATA_SOURCE = (
    "access_policies_url",
    "activate_message",
    "offers_count",
    "phase",
    "project_items_count",
    "rating",
    "related_platforms",
    "restrictions",
    "service_opinion_count",
    "sla_url",
    "slug",
)
UNIQUE_DATA_SOURCE_COLS_FOR_SERVICE = (
    "datasource_classification",
    "jurisdiction",
    "link_research_product_metadata_license_urls",
    "persistent_identity_systems",
    "preservation_policy_url",
    "research_entity_types",
    "research_product_access_policies",
    "research_product_licensing_urls",
    "research_product_metadata_access_policies",
    "resource_level_url",
    "submission_policy_url",
    "thematic",
    "version_control",
)
