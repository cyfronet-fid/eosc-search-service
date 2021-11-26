# pylint: disable=too-few-public-methods

"""Application DB models"""

from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Account(Base):
    """User account"""

    __tablename__ = "accounts"
    id = Column("id", Integer, primary_key=True)
    name = Column("name", String, nullable=False)
    token = Column("token", String)

    def __repr__(self):
        return f"Account(id={self.id}, name={self.name}, token={self.token})"
