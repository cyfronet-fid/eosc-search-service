# pylint: disable=missing-module-docstring,unused-import
# coding: utf-8

from __future__ import annotations

import re
from datetime import date, datetime
from typing import Any, Dict, List, Optional

from pydantic import AnyUrl, BaseModel, EmailStr, validator


class Forbidden(BaseModel):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.

    Forbidden - a model defined in OpenAPI

        message: The message of this Forbidden [Optional].
    """

    message: Optional[str] = None


Forbidden.update_forward_refs()