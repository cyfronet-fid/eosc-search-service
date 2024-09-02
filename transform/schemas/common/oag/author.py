from typing import Dict, Optional, Union

from pydantic import BaseModel

from schemas.common.oag.pid import PID
from schemas.common.oag.provenance import Provenance


class Author(BaseModel):
    """
    Model representing an author.

    Attributes:
        fullname (str):
            The full name of the author.
        name (str):
            The name of the author.
        rank (int):
            The rank of the author.
        surname (str):
            The surname of the author.
        pid (Optional[Dict[str, Union[PID, Provenance]]]):
            An optional dictionary containing the persistent identifier (PID)
            information for the author. This dictionary must have two keys:

            - "id": Represents the PID, which includes information like the scheme
              and the value of the identifier.
            - "provenance": Represents the provenance information, including the
              source of the PID and the trust level associated with it.
    """

    fullname: str
    name: str
    rank: int
    surname: str
    pid: Optional[Dict[str, Union[PID, Provenance]]] = None
