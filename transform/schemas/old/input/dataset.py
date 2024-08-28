# pylint: disable=duplicate-code
"""Dataset expected input schema"""

dataset_input_schema = {
    "affiliation": [
        "array<struct<id:string,name:string,pid:array<struct<type:string,value:string>>>>"
    ],
    "author": [
        "array<struct<fullname:string,name:string,rank:int,surname:string,pid:struct<id:struct<scheme:string,value:string>,provenance:struct<provenance:string,trust:string>>>>"
    ],
    "bestaccessright": ["struct<code:string,label:string,scheme:string>"],
    "collectedfrom": ["array<struct<key:string,value:string>>"],
    "context": [
        "array<struct<code:string,label:string,provenance:array<struct<provenance:string,trust:string>>>>"
    ],
    "contributor": ["array<string>"],
    "country": [
        "array<struct<code:string,label:string,provenance:struct<provenance:string,trust:string>>>"
    ],
    "coverage": ["array<string>"],
    "dateofcollection": ["string"],
    "description": ["array<string>"],
    "embargoenddate": ["string"],
    "eoscIF": [
        "array<struct<code:string,label:string,semanticRelation:string,url:string>>"
    ],
    "format": ["array<string>"],
    "geolocation": ["array<struct<box:string,place:string,point:string>>"],
    "id": ["string"],
    "indicator": ["struct<usageCounts:struct<downloads:string,views:string>>"],
    "instance": [
        "array<struct<accessright:struct<code:string,label:string,scheme:string,openAccessRoute:string>,alternateIdentifier:array<struct<scheme:string,value:string>>,eoscDsId:array<string>,hostedby:struct<key:string,value:string>,pid:array<struct<scheme:string,value:string>>,publicationdate:string,refereed:string,type:string,url:array<string>,license:string>>"
    ],
    "keywords": ["array<string>"],
    "language": ["struct<code:string,label:string>"],
    "lastupdatetimestamp": ["int"],
    "maintitle": ["string"],
    "originalId": ["array<string>"],
    "pid": ["array<struct<scheme:string,value:string>>"],
    "projects": [
        "array<struct<acronym:string,code:string,funder:struct<fundingStream:string,jurisdiction:string,name:string,shortName:string>,id:string,provenance:struct<provenance:string,trust:string>,title:string,validated:struct<validatedByFunder:boolean,validationDate:string>>>"
    ],
    "publicationdate": ["string"],
    "publisher": ["string"],
    "relations": [
        "array<struct<provenance:struct<provenance:string,trust:string>,reltype:struct<name:string,type:string>,source:string,target:string,targetType:string>>"
    ],
    "size": ["string"],
    "source": ["array<struct>"],
    "subject": [
        "struct<sdg:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,ddc:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,fos:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>>"
    ],
    "subtitle": ["string"],
    "type": ["string"],
    "version": ["string"],
}
