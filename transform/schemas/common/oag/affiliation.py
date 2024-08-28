from typing import List

from pydantic import BaseModel

from schemas.common.oag.pid import PID


class Affiliation(BaseModel):
    """
    Model representing an affiliation.

    Attributes:
        id (str):
            The ID of the affiliation.
        name (str):
            The name of the affiliation.
        pid (List[PID]):
            A list of persistent identifiers for the affiliation.
    """

    id: str
    name: str
    pid: List[PID]
