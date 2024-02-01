# pylint: disable=missing-module-docstring,missing-class-docstring
from typing import Any, Optional

from pydantic import BaseModel


class SessionData(BaseModel):
    username: Optional[str] = None
    aai_state: Optional[str] = None
    aai_id: Optional[str] = None
    rp_handler: Any = None
    session_uuid: str
