from typing import Optional

from pydantic import BaseModel

from schemas.common.oag.funder import Funder
from schemas.common.oag.provenance import Provenance


class Project(BaseModel):
    """
    Model representing a project.

    Attributes:
        acronym (Optional[str]):
            The acronym of the project.
        code (Optional[str]):
            The code of the project.
        funder (Optional[Funder]):
            The funder information for the project.
        id (str):
            The ID of the project.
        provenance (Optional[Provenance]):
            The provenance information for the project.
        title (str):
            The title of the project.
        validated (Optional[dict]):
            Validation details for the project.
    """

    acronym: Optional[str]
    code: Optional[str]
    funder: Optional[Funder]
    id: str
    provenance: Optional[Provenance]
    title: str
    validated: Optional[dict]
