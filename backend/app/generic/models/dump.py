# pylint: disable=missing-module-docstring
# coding: utf-8

from __future__ import annotations

from typing import List

from pydantic import BaseModel

from app.generic.models.dump_elements import DumpElements


class Dump(BaseModel):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.

    Dump - a model defined in OpenAPI

        name: The name of this Dump.
        created_at: The created_at of this Dump.
        updated_at: The updated_at of this Dump.
        elements: The elements of this Dump.
    """

    name: str
    created_at: str
    updated_at: str
    elements: List[DumpElements]


Dump.update_forward_refs()
