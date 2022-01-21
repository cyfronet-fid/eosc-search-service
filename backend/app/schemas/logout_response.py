# pylint: disable=missing-module-docstring,missing-class-docstring
from pydantic import BaseModel


class LogoutResponse(BaseModel):
    msg: str
