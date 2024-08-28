from pydantic import BaseModel


class PID(BaseModel):
    """
    Model representing a persistent identifier (PID).

    Attributes:
        scheme (str):
            The scheme of the PID.
        value (str):
            The value of the PID.
    """

    scheme: str
    value: str
