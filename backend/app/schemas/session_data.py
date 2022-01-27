# pylint: disable=missing-module-docstring,missing-class-docstring
from typing import Any, Optional

from pydantic import BaseModel


class SessionData(BaseModel):
    username: Optional[str]
    aai_state: Optional[str]
    rp_handler: Any
