# pylint: disable=duplicate-code
"""Training expected schema after transformations"""

training_output_schema = {
    "alternative_ids": "array<string>",
    "author_names": "array<string>",
    "author_names_tg": "array<string>",
    "best_access_right": "string",
    "catalogue": "string",  # TODO delete
    "catalogues": "array<string>",
    "content_type": "array<string>",
    "description": "string",
    "duration": "bigint",
    "eosc_provider": "array<string>",  # TODO delete
    "geographical_availabilities": "array<string>",
    "id": "string",
    "keywords": "array<string>",
    "keywords_tg": "array<string>",
    "language": "array<string>",
    "learning_outcomes": "array<string>",
    "level_of_expertise": "string",
    "license": "string",
    "open_access": "boolean",
    "providers": "array<string>",
    "publication_date": "date",
    "qualification": "array<string>",
    "related_services": "array<string>",
    "resource_organisation": "string",
    "resource_type": "array<string>",
    "scientific_domains": "array<array<string>>",
    "target_group": "array<string>",
    "title": "string",
    "type": "string",
    "unified_categories": "array<string>",
    "url": "array<string>",
    "url_type": "string",
}
