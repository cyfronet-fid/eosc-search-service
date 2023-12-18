# pylint: disable=duplicate-code
"""Organisation expected input schema"""

organisation_input_schema = {
    "alternativenames": "array<string>",
    "country": "struct<code:string,label:string>",
    "id": "string",
    "legalname": "string",
    "legalshortname": "string",
    "pid": "array<struct<type:string,value:string>>",
    "websiteurl": "string",
}
