"""Dependencies"""

from sqlalchemy.orm import Session
from starlette.requests import Request


def get_db(request: Request) -> Session:
    """Extract Session from application state"""
    # pylint: disable=protected-access
    return request.app.state._db
