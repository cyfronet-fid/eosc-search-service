# pylint: disable=duplicate-code
"""Catalogue expected schema after transformations"""

catalogue_output_schema = {
    "abbreviation": "string",
    "description": "string",
    "id": "string",
    "keywords": "array<string>",
    "keywords_tg": "array<string>",
    "legal_status": "string",
    "pid": "string",
    "publication_date": "date",
    "scientific_domains": "array<string>",
    # "structure_type": "array<string>", # Not present in PC, it might be added in the future
    "title": "string",
    "type": "string",
}
