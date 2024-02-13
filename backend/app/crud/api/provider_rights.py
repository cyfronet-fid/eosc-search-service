# pylint: disable=missing-module-docstring, missing-function-docstring, no-name-in-module
from typing import List

from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified

from app.models.api.provider_rights import ProviderRights
from app.models.user import User


def update_data_provider_rights(
    db: Session, provider: User, new_fields: List[str]
) -> ProviderRights:
    data_rights = provider.provider_rights
    data_rights.read.extend(new_fields)
    data_rights.write.extend(new_fields)
    flag_modified(data_rights, "read")
    flag_modified(data_rights, "write")
    db.merge(data_rights)
    db.flush()
    db.commit()
    db.refresh(data_rights)
    return data_rights
