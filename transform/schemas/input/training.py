"""Input training expected schema"""

from datetime import datetime
from typing import List, Union

from pydantic import AnyHttpUrl, BaseModel, EmailStr


class AlternativeIdentifier(BaseModel):
    """
    Model representing an alternative identifier.

    Attributes:
        type (str):
            The type of the alternative identifier.
        value (str):
            The value of the alternative identifier.
    """

    type: str
    value: str


class TrainingContact(BaseModel):
    """
    Model representing a contact person.

    Attributes:
        email (EmailStr):
            The email address of the contact person.
        firstName (str):
            The first name of the contact person.
        lastName (str):
            The last name of the contact person.
        organisation (str):
            The organisation of the contact person.
        phone (str):
            The phone number of the contact person.
        position (str):
            The position of the contact person.
    """

    email: EmailStr
    firstName: str
    lastName: str
    organisation: str
    phone: str
    position: str


class ScientificDomain(BaseModel):
    """
    Model representing a scientific domain and its subdomain.

    Attributes:
        scientificDomain (str):
            The scientific domain.
        scientificSubdomain (str):
            The scientific subdomain.
    """

    scientificDomain: str
    scientificSubdomain: str


class TrainingInputSchema(BaseModel):
    """
    Pydantic model representing the expected input schema for training.

    Attributes:
        accessRights (str):
            The access rights of the training.
        alternativeIdentifiers (List[AlternativeIdentifier]):
            A list of alternative identifiers for the training.
        authors (List[str]):
            A list of authors of the training.
        catalogueId (str):
            The catalogue identifier for the training.
        contact (Union[TrainingContact, str]):
            The contact information for the training, either as a Contact object or a string.
        contentResourceTypes (List[str]):
            A list of content resource types for the training.
        description (str):
            A detailed description of the training.
        duration (str):
            The duration of the training.
        eoscRelatedServices (List[str]):
            A list of EOSC related services for the training.
        expertiseLevel (str):
            The expertise level required for the training.
        geographicalAvailabilities (List[str]):
            A list of geographical locations where the training is available.
        id (str):
            The unique identifier of the training.
        keywords (List[str]):
            A list of keywords associated with the training.
        languages (List[str]):
            A list of languages in which the training is available.
        learningOutcomes (List[str]):
            A list of learning outcomes for the training.
        learningResourceTypes (List[str]):
            A list of learning resource types for the training.
        license (str):
            The license under which the training is provided.
        qualifications (List[str]):
            A list of qualifications associated with the training.
        resourceOrganisation (str):
            The organisation responsible for the training.
        resourceProviders (List[str]):
            A list of resource providers for the training.
        scientificDomains (List[ScientificDomain]):
            A list of scientific domains and subdomains associated with the training.
        targetGroups (List[str]):
            A list of target groups for the training.
        title (str):
            The title of the training.
        url (AnyHttpUrl):
            The URL of the training.
        urlType (str):
            The type of the URL.
        versionDate (datetime):
            The version date of the training (ISO 8601 format).
    """

    accessRights: str
    alternativeIdentifiers: List[AlternativeIdentifier]
    authors: List[str]
    catalogueId: str
    contact: Union[TrainingContact, str]
    contentResourceTypes: List[str]
    description: str
    duration: str
    eoscRelatedServices: List[str]
    expertiseLevel: str
    geographicalAvailabilities: List[str]
    id: str
    keywords: List[str]
    languages: List[str]
    learningOutcomes: List[str]
    learningResourceTypes: List[str]
    license: str
    qualifications: List[str]
    resourceOrganisation: str
    resourceProviders: List[str]
    scientificDomains: List[ScientificDomain]
    targetGroups: List[str]
    title: str
    url: AnyHttpUrl
    urlType: str
    versionDate: datetime
