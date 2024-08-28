from pydantic import BaseModel


class Container(BaseModel):
    """
    Model representing a container.

    Attributes:
        edition (str):
            The edition of the container.
        ep (str):
            The end page of the container.
        iss (str):
            The ISS number of the container.
        issnLinking (str):
            The linking ISSN of the container.
        issnOnline (str):
            The online ISSN of the container.
        issnPrinted (str):
            The printed ISSN of the container.
        name (str):
            The name of the container.
        sp (str):
            The start page of the container.
        vol (str):
            The volume of the container.
        conferencedate (str):
            The conference date of the container.
    """

    edition: str
    ep: str
    iss: str
    issnLinking: str
    issnOnline: str
    issnPrinted: str
    name: str
    sp: str
    vol: str
    conferencedate: str
