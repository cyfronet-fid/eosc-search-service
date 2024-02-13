# pylint: disable=missing-module-docstring,missing-class-docstring
from typing import Any, Optional

from pydantic import BaseModel


class SessionData(BaseModel):
    username: Optional[str]
    email: Optional[str]
    aai_state: Optional[str]
    aai_id: Optional[str]
    edit_link: Optional[str]
    fav: int = 0
    jwttoken: Optional[str]
    rp_handler: Any = None
    session_uuid: str
