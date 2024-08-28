from typing import Optional

from pydantic import BaseModel

from schemas.common.oag.provenance import Provenance


class Country(BaseModel):
    """
    Model representing a country.

    Attributes:
        code (str):
            The code of the country.
        label (str):
            The label of the country.
        provenance (Provenance):
            The provenance information for the country.
    """

    code: str
    label: str
    provenance: Optional[Provenance]
