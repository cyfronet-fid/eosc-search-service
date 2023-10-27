"""Software expected schema after transformations"""

software_output_schema = {
    "author_names": "array<string>",
    "author_names_tg": "array<string>",
    "author_pids": "array<array<string>>",
    "best_access_right": "string",
    "country": "array<string>",
    "datasource_pids": "array<string>",
    "description": "array<string>",
    "direct_url": "array<string>",
    "document_type": "array<string>",
    "documentation_url": "array<string>",
    "doi": "array<string>",
    "eosc_if": "array<string>",
    "exportation": "array<string>",
    "funder": "array<string>",
    "id": "string",
    "keywords": "array<string>",
    "keywords_tg": "array<string>",
    "language": "array<string>",
    "open_access": "boolean",
    "popularity": "int",
    "programming_language": "string",
    "publication_date": "date",
    "publisher": "string",
    "relations": "array<string>",
    "relations_long": "array<string>",
    "research_community": "array<string>",
    "scientific_domains": "array<string>",
    "sdg": "array<string>",
    "source": "array<string>",
    "subtitle": "string",  # Very few records have subtitle
    "title": "string",
    "type": "string",
    "unified_categories": "array<string>",
    "url": "array<string>",
    "usage_counts_downloads": "string",
    "usage_counts_views": "string",
}
