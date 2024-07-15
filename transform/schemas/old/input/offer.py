# pylint: disable=duplicate-code
"""Offers expected input schema"""

offer_input_schema = {
    "description": ["string"],
    "eosc_if": ["array<string>"],
    "id": ["bigint"],
    "iid": ["bigint"],
    "internal": ["boolean"],
    "name": ["string"],
    "order_type": ["string"],
    "parameters": [
        "array<struct<config:struct<exclusiveMaximum:boolean,exclusiveMinimum:boolean,maxItems:bigint,maximum:bigint,minItems:bigint,minimum:bigint,mode:string,values:array<string>>,description:string,id:string,label:string,type:string,unit:string,value:string,value_type:string>>"
    ],
    "publication_date": ["string"],
    "service_id": ["bigint"],
    "status": ["string"],
    "tag_list": ["array<string>"],
    "updated_at": ["string"],
    "usage_counts_downloads": ["bigint"],
    "usage_counts_views": ["bigint"],
    "voucherable": ["boolean"],
}
