# pylint: disable=missing-module-docstring, missing-class-docstring, too-few-public-methods
from sqlalchemy import Boolean, Column, String
from sqlalchemy.orm import relationship

from app.database import Base

target_metadata = [Base.metadata]


class User(Base):
    __tablename__ = "user"

    aaiId = Column(String, primary_key=True, unique=True, nullable=False)

    provider = Column(Boolean, default=False, nullable=False)
    admin = Column(Boolean, default=False, nullable=False)
    superAdmin = Column(Boolean, default=False, nullable=False)

    data = relationship("UserData", uselist=False)
    provider_rights = relationship("ProviderRights", uselist=False)
