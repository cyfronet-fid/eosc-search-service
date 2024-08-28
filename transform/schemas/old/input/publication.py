# pylint: disable=duplicate-code
"""Publication expected input schema"""

publication_input_schema = {
    "affiliation": [
        "array<struct<id:string,name:string,pid:array<struct<type:string,value:string>>>>"
    ],
    "author": [
        "array<struct<fullname:string,name:string,rank:int,surname:string,pid:array<struct<id:struct<scheme:string,value:string>,provenance:struct<provenance:string,trust:string>>>>>"
    ],
    "bestaccessright": ["struct<code:string,label:string,scheme:string>"],
    "collectedfrom": ["array<struct<key:string,value:string>>"],
    "container": [
        "struct<edition:string,ep:string,iss:string,issnLinking:string,issnOnline:string,issnPrinted:string,name:string,sp:string,vol:string,conferencedate:string>"
    ],
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
    "eoscIF": ["array<string>"],
    "format": ["array<string>"],
    "fulltext": ["array<string>"],
    "id": ["string"],
    "indicator": ["struct<usageCounts_downloads:string,usageCounts_views:string>"],
    "instance": [
        "array<struct<accessright:struct<code:string,label:string,scheme:string,openAccessRoute:string>,alternateIdentifier:array<struct<scheme:string,value:string>>,eoscDsId:array<string>,hostedby:struct<key:string,value:string>,pid:array<struct<scheme:string,value:string>>,publicationdate:string,refereed:string,type:string,url:array<string>,license:string,fulltext:string,articleprocessingcharge:struct<amount:string,currency:string>>>"
    ],
    "keywords": ["array<string>"],
    "language": ["struct<code:string,label:string>"],
    "lastupdatetimestamp": ["bigint"],
    "maintitle": ["string"],
    "originalId": ["array<string>"],
    "pid": ["array<struct<scheme:string,value:string>>"],
    "projects": [
        "array<struct<code:string,funder:struct<fundingStream:string,jurisdiction:string,name:string,shortName:string>,id:string,provenance:struct<provenance:string,trust:string>,title:string,acronym:string,validated:struct<validatedByFunder:boolean,validationDate:string>>>"
    ],
    "publicationdate": ["string"],
    "publisher": ["string"],
    "relations": [
        "array<struct<provenance:struct<provenance:string,trust:string>,reltype:struct<name:string,type:string>,source:string,target:string,targetType:string>>"
    ],
    "source": ["array<string>"],
    "subject": [
        "struct<lcsh:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,ddc:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,sdg:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,fos:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,mag:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,jel:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,ndc:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,agrovoc:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,udc:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,mesh:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,pacs:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,ndlc:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>,msc:array<struct<provenance:struct<provenance:string,trust:string>,value:string>>>"
    ],
    "subtitle": ["string"],
    "type": ["string"],
}
