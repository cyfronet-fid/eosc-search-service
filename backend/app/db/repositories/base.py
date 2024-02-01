"""Base for repositories"""

from sqlalchemy.orm import Session


# pylint: disable=too-few-public-methods
class BaseRepository:
    """Base for repositories"""

    def __init__(self, db: Session) -> None:
        self.db = db
