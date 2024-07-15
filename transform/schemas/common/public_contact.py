from datetime import datetime

from pydantic import BaseModel, EmailStr


class PublicContact(BaseModel):
    """
    Model representing a public contact.

    Attributes:
        contactable_id (int):
            The ID of the contactable entity.
        contactable_type (str):
            The type of the contactable entity.
        created_at (datetime):
            The date and time when the contact was created (ISO 8601 format).
        email (EmailStr):
            The email address of the contact.
        first_name (str):
            The first name of the contact.
        id (int):
            The unique identifier of the contact.
        last_name (str):
            The last name of the contact.
        organisation (str):
            The organisation associated with the contact.
        phone (str):
            The phone number of the contact.
        position (str):
            The position or title of the contact.
        updated_at (datetime):
            The date and time when the contact was last updated (ISO 8601 format).
    """

    contactable_id: int
    contactable_type: str
    created_at: datetime
    email: EmailStr
    first_name: str
    id: int
    last_name: str
    organisation: str
    phone: str
    position: str
    updated_at: datetime
