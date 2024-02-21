# pylint: disable=duplicate-code
"""Catalogues expected input schema"""

catalogue_input_schema = {
    "abbreviation": "string",
    "affiliations": "array<string>",
    "city": "string",
    "country": "string",
    "created_at": "string",
    "description": "string",
    "hosting_legal_entity": "string",
    "id": "bigint",
    "legal_entity": "boolean",
    "legal_status": "array<string>",
    "multimedia_urls": "array<struct<name:string,url:string>>",
    "name": "string",
    "networks": "array<string>",
    "participating_countries": "array<string>",
    "pid": "string",
    "postal_code": "string",
    "public_contacts": "array<struct<id:bigint,first_name:string,last_name:string,email:string,phone:string,position:string,organisation:string,contactable_type:string,contactable_id:bigint,created_at:string,updated_at:string>>",
    "region": "string",
    "scientific_domains": "array<string>",
    "slug": "string",
    "street_name_and_number": "string",
    "tag_list": "array<string>",
    "updated_at": "string",
    "webpage_url": "string",
}
