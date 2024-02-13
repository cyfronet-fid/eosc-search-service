# pylint: disable=missing-module-docstring, missing-class-docstring, too-few-public-methods
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.dialects import postgresql

from app.database import Base


class ProviderRights(Base):
    __tablename__ = "provider_rights"

    id = Column(Integer, primary_key=True)
    providerId = Column(String, ForeignKey("user.aaiId"))

    read = Column(postgresql.ARRAY(String), nullable=True)
    write = Column(postgresql.ARRAY(String), nullable=True)
