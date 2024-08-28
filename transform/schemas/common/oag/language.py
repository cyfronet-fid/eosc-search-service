from pydantic import BaseModel


class Language(BaseModel):
    """
    Model representing a Language.

    Attributes:
        code (str): The code of the language.
        label (str): The label of the language.
    """

    code: str
    label: str
