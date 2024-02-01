"""Database-specific dependencies"""

from typing import Callable, Type

from fastapi import Depends
from sqlalchemy.orm import Session
from starlette.requests import Request

from app.db.repositories.base import BaseRepository


def get_db(request: Request) -> Session:
    """Extract Session from application state"""
    # pylint: disable=protected-access
    return request.app.state._db


def get_repo(repo_type: Type[BaseRepository]) -> Callable:
    """Dynamically return a getter for a repo_type"""

    def get_repository(db: Session = Depends(get_db)) -> repo_type:
        return repo_type(db)

    return get_repository
