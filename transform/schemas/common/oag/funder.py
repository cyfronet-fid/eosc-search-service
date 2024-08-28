from pydantic import BaseModel


class Funder(BaseModel):
    """
    Model representing funder information.

    Attributes:
        funding_stream (FundingStream):
            The funding stream details.
        jurisdiction (str):
            The jurisdiction of the funding.
        name (str):
            The name of the funding.
        short_name (str):
            The short name of the funding.
    """

    funding_stream: str
    jurisdiction: str
    name: str
    short_name: str
