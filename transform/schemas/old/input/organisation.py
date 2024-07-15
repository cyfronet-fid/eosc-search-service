# pylint: disable=duplicate-code
"""Organisation expected input schema"""

organisation_input_schema = {
    "alternativenames": ["array<string>"],
    "country": ["struct<code:string,label:string>"],
    "id": ["string"],
    "legalname": ["string"],
    "legalshortname": ["string"],
    "pid": ["array<struct<type:string,value:string>>"],
    "related_dataset_ids": ["array<string>"],
    "related_organisation_titles": ["array<string>"],
    "related_other_ids": ["array<string>"],
    "related_publication_ids": ["array<string>"],
    "related_software_ids": ["array<string>"],
    "websiteurl": ["string"],
}
