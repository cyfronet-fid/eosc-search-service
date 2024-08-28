from typing import Optional

from pydantic import AnyHttpUrl, BaseModel


class EoscIf(BaseModel):
    """
    A class used to represent an EOSC Interface

    Attributes:
        code (str):
            The interface code.
        label (str):
            The interface label.
        semantic_relation (str):
            The semantic relation of the interface.
        url (Optional[AnyHttpUrl]):
            The URL of the interface.
    """

    code: str
    label: str
    semantic_relation: str
    url: Optional[AnyHttpUrl]
