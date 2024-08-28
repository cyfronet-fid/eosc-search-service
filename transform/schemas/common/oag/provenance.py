from pydantic import BaseModel


class Provenance(BaseModel):
    """
    Model representing provenance information.

    Attributes:
        provenance (str):
            The provenance source.
        trust (str):
            The trust level of the provenance.
    """

    provenance: str
    trust: str
