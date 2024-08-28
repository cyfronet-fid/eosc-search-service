from pydantic import BaseModel


class GeoLocation(BaseModel):
    """
    Model representing a geographic location.

    Attributes:
        point (Optional[str]):
            The point representation of the location.
        box (Optional[str]):
            The box representation of the location.
        place (Optional[str]):
            The place representation of the location.
    """

    point: str
    box: str
    place: str
