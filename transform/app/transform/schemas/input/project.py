# pylint: disable=duplicate-code
# pylint: disable=line-too-long
"""Project expected input schema"""

project_input_schema = {
    "acronym": "string",
    "callidentifier": "string",
    "code": "string",
    "enddate": "string",
    "funding": "array<struct<funding_stream:struct<description:string,id:string>,jurisdiction:string,name:string,shortName:string>>",
    "granted": "struct<currency:string,fundedamount:float,totalcost:float>",
    "h2020programme": "array<struct<code:string,description:string>>",
    "id": "string",
    "keywords": "string",
    "openaccessmandatefordataset": "boolean",
    "openaccessmandateforpublications": "boolean",
    "startdate": "string",
    "subject": "array<string>",
    "summary": "string",
    "title": "string",
    "websiteurl": "string",
}
