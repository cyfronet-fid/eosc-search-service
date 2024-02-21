# pylint: disable=duplicate-code
"""Catalogue expected schema after transformations"""

catalogue_output_schema = {
    "abbreviation": "string",
    "created_at": "date",
    "description": "string",
    "id": "string",
    "keywords": "array<string>",
    "keywords_tg": "array<string>",
    "legal_status": "array<string>",
    "pid": "string",
    "scientific_domains": "array<string>",
    # "structure_type": "array<string>", # Not present in PC, it might be added in the future
    "title": "string",
    "type": "string",
}
