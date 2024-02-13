# pylint: disable=missing-module-docstring, missing-function-docstring, no-name-in-module
from sqlalchemy.orm import Session

from app.crud.api.user_data import create_user_data
from app.models.user import User


def get_user(db: Session, aai_id: str) -> User:
    return db.query(User).filter_by(aaiId=aai_id).first()


def create_user(db: Session, aai_id: str) -> User:
    db_user = User(aaiId=aai_id)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    create_user_data(db, user=db_user)

    return db_user
