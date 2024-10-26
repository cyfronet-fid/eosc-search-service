# pylint: disable=duplicate-code
"""Software expected input schema"""

software_input_schema = {
    "affiliation": [
        "array<struct<id:string,name:string,pid:array<struct<type:string,value:string>>>>"
    ],
    "author": [
        "array<struct<fullname:string,name:string,rank:int,surname:string,pid:struct<id:struct<scheme:string,value:string>,provenance:struct<provenance:string,trust:string>>>>"
    ],
    "bestaccessright": ["struct<code:string,label:string,scheme:string>"],
    "codeRepositoryUrl": ["array<string>"],  # TODO decide what to do
    "collectedfrom": ["array<struct<key:string,value:string>>"],
    "context": [
        "array<struct<code:string,label:string,provenance:struct<provenance:string,trust:string>>>"
    ],
    "contributor": ["array<string>"],
    "country": [
        "array<struct<code:string,label:string,provenance:struct<provenance:string,trust:string>>>"
    ],
    "coverage": ["array<string>"],
    "dateofcollection": ["string"],
    "description": ["array<string>"],
    "documentationUrl": ["array<string>"],
    "embargoenddate": ["string"],
    "eoscIF": [
        "array<struct<code:string,label:string,semanticRelation:string,url:string>>"
    ],
    "format": ["array<string>"],
    "id": ["string"],
    "indicator": ["struct<usageCounts:struct<downloads:bigint,views:bigint>>"],
    "instance": [
        "array<struct<accessright:struct<code:string,label:string,scheme:string>,alternateIdentifier:array<struct<scheme:string,value:string>>,eoscDsId:array<string>,hostedby:struct<key:string,value:string>,license:string,pid:array<struct<scheme:string,value:string>>,publicationdate:string,refereed:string,type:string,url:array<string>>>"
    ],
    "keywords": ["array<string>"],
    "language": ["struct<code:string,label:string>"],
    "lastupdatetimestamp": ["bigint"],
    "maintitle": ["string"],
    "originalId": ["array<string>"],
    "pid": ["array<struct<scheme:string,value:string>>"],
    "programmingLanguage": ["string"],
    "projects": [
        "array<struct<acronym:string,code:string,funder:struct<fundingStream:string,jurisdiction:string,name:string,shortName:string>,id:string,provenance:struct<provenance:string,trust:string>,title:string,validated:struct<validatedByFunder:boolean,validationDate:string>>>"
    ],
    "publicationdate": ["string"],
    "publisher": ["string"],
    "relations": [
        "array<struct<provenance:struct<provenance:string,trust:string>,reltype:struct<name:string,type:string>,source:string,target:string,targetType:string>>"
    ],
    "source": ["array<string>"],
    "subject": [
        "struct<sdg:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,fos:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>>"
    ],
    "subtitle": ["string"],
    "type": ["string"],
}
