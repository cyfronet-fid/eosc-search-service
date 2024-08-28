from typing import Dict, List, Optional

from pydantic import BaseModel

from schemas.common.oag.provenance import Provenance


class SubjectEntry(BaseModel):
    """
    Model representing a subject entry.

    Attributes:
        provenance (Optional[Provenance]):
            The provenance information for the subject entry.
        value (str):
            The value of the subject entry.
    """

    provenance: Optional[Provenance]
    value: str


class Subject(BaseModel):
    """
    Model representing a subject.

    Attributes:
        subjects (Optional[Dict[str, List[SubjectEntry]]]):
            A dictionary where the keys are subject types, and the values are lists of SubjectEntry objects.
            Each SubjectEntry object contains the value of the subject and its provenance information.
    """

    subjects: Optional[Dict[str, List[SubjectEntry]]]
