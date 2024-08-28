from typing import List

from pydantic import BaseModel

from schemas.common.oag.provenance import Provenance


class Context(BaseModel):
    """
    Model representing context information.

    Attributes:
        code (str):
            The code of the context.
        label (str):
            The label of the context.
        provenance (List[Provenance]):
            A list of provenance information for the context.
    """

    code: str
    label: str
    provenance: List[Provenance]
