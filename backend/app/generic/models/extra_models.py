# pylint: disable=missing-module-docstring,no-name-in-module,too-few-public-methods
# coding: utf-8

from pydantic import BaseModel


class TokenModel(BaseModel):
    """Defines a token model."""

    sub: str
