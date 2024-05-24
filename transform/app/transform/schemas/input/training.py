# pylint: disable=duplicate-code
"""Raw, input training expected schema"""

training_input_schema = {
    "accessRights": ["string"],
    "alternativeIdentifiers": ["array<struct<type:string,value:string>>"],
    "authors": ["array<string>"],
    "catalogueId": ["string"],
    "contact": [
        "struct<email:string,firstName:string,lastName:string,organisation:string,phone:string,position:string>",
        "string",
    ],
    "contentResourceTypes": ["array<string>"],
    "description": ["string"],
    "duration": ["string"],
    "eoscRelatedServices": ["array<string>"],
    "expertiseLevel": ["string"],
    "geographicalAvailabilities": ["array<string>"],
    "id": ["string"],
    "keywords": ["array<string>"],
    "languages": ["array<string>"],
    "learningOutcomes": ["array<string>"],
    "learningResourceTypes": ["array<string>"],
    "license": ["string"],
    "qualifications": ["array<string>"],
    "resourceOrganisation": ["string"],
    "resourceProviders": ["array<string>"],
    "scientificDomains": [
        "array<struct<scientificDomain:string,scientificSubdomain:string>>"
    ],
    "targetGroups": ["array<string>"],
    "title": ["string"],
    "url": ["string"],
    "urlType": ["string"],
    "versionDate": ["bigint"],
}
