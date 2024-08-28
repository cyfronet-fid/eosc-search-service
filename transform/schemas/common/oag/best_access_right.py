from pydantic import BaseModel


class BestAccessRight(BaseModel):
    """
    Model representing the best access right.

    Attributes:
        code (str):
            The code of the access right.
        label (str):
            The label of the access right.
        scheme (str):
            The scheme of the access right.
    """

    code: str
    label: str
    scheme: str
