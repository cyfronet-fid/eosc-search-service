from pydantic import BaseModel


class KeyValueModel(BaseModel):
    """
    Model representing key-value.

    Attributes:
        key (str):
            The key, identifier of the KeyValueModel.
        value (str):
            The value, name of the KeyValueModel.
    """

    key: str
    value: str
