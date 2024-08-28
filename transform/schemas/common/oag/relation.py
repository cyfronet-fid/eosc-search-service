from typing import Optional

from pydantic import BaseModel

from schemas.common.oag.provenance import Provenance


class Reltype(BaseModel):
    """
    Model representing a relationship type.

    Attributes:
        name (str):
            The name of the relationship type.
        type (str):
            The type of the relationship type.
    """

    name: str
    type: str


class Relation(BaseModel):
    """
    Model representing a relation.

    Attributes:
        provenance (Optional[Provenance]):
            The provenance of the relation.
        reltype (Optional[Reltype]):
            The type of the relation.
        source (Optional[str]):
            The source of the relation.
        target (Optional[str]):
            The target of the relation.
        targetType (Optional[str]):
            The target type of the relation.
    """

    provenance: Optional[Provenance]
    reltype: Optional[Reltype]
    source: Optional[str]
    target: Optional[str]
    targetType: Optional[str]
