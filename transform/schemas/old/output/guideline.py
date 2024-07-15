# pylint: disable=duplicate-code
"""Guideline expected schema after transformations"""

guideline_output_schema = {
    "alternative_ids": "str",
    "author_affiliations": "list",
    "author_affiliations_id": "list",
    "author_family_names": "list",
    "author_given_names": "list",
    "author_names": "list",
    "author_names_id": "list",
    "author_names_tg": "list",
    "author_types": "list",
    "catalogue": "str",  # TODO delete
    "catalogues": "list",
    "creators": "str",
    "description": "list",
    "doi": "list",
    "domain": "str",
    "eosc_guideline_type": "str",
    "eosc_integration_options": "list",
    "id": "str",
    "provider": "str",  # TODO delete
    "providers": "list",
    "publication_date": "str",
    "publication_year": "int",
    "related_standards_id": "list",
    "related_standards_uri": "list",
    "right_id": "list",
    "right_title": "list",
    "right_uri": "list",
    "status": "str",
    "title": "list",
    "type": "str",
    "type_general": "list",
    "type_info": "list",
    "updated_at": "str",
    "uri": "list",
}
