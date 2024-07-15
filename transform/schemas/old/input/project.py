# pylint: disable=duplicate-code
# pylint: disable=line-too-long
"""Project expected input schema"""

project_input_schema = {
    "acronym": ["string"],
    "callidentifier": ["string"],
    "code": ["string"],
    "enddate": ["string"],
    "funding": [
        "array<struct<funding_stream:struct<description:string,id:string>,jurisdiction:string,name:string,shortName:string>>"
    ],
    "granted": ["struct<currency:string,fundedamount:float,totalcost:float>"],
    "h2020programme": ["array<struct<code:string,description:string>>"],
    "id": ["string"],
    "keywords": ["string"],
    "openaccessmandatefordataset": ["boolean"],
    "openaccessmandateforpublications": ["boolean"],
    "related_dataset_ids": ["array<string>"],
    "related_organisation_titles": ["array<string>"],
    "related_other_ids": ["array<string>"],
    "related_publication_ids": ["array<string>"],
    "related_software_ids": ["array<string>"],
    "startdate": ["string"],
    "subject": ["array<string>"],
    "summary": ["string"],
    "title": ["string"],
    "websiteurl": ["string"],
}
