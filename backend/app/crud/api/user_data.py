# pylint: disable=missing-module-docstring, missing-function-docstring, no-name-in-module
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified

from app.models import UserData
from app.models.api.user_data import UserDataProps
from app.models.user import User
from app.utils.dict_utils import deep_merge


def create_user_data(db: Session, user: User, data=None) -> UserData:
    if data is None:
        data = {}

    user_data = UserData(userId=user.aaiId, data=data)
    db.add(user_data)
    db.commit()
    db.refresh(user_data)
    return user_data


def update_user_data(db: Session, user: User, new_data: UserDataProps) -> UserData:
    user_data = user.data
    user_data.data = deep_merge(new_data, user.data.data)
    flag_modified(user_data, "data")
    db.merge(user_data)
    db.flush()
    db.commit()
    db.refresh(user_data)
    return user_data
