"""Expected schema for URLs"""

from pydantic import AnyHttpUrl, BaseModel


class BasicURL(BaseModel):
    """
    Model representing basic URL structure with a name and URL.

    Attributes:
        name (str):
            The name of the item.
        url (AnyHttpUrl):
            The URL of the item.
    """

    name: str
    url: AnyHttpUrl
