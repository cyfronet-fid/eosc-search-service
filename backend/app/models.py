# pylint: disable=too-few-public-methods

"""Application DB models"""
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.orm.exc import DetachedInstanceError

Base = declarative_base()


class BaseModel:
    """Class with __repr__ helper"""

    def _repr(self, **fields: dict[str, any]) -> str:
        """
        Helper for __repr__
        """
        field_strings = []
        at_least_one_attached_attribute = False
        for key, field in fields.items():
            try:
                field_strings.append(f"{key}={field!r}")
            except DetachedInstanceError:
                field_strings.append(f"{key}=DetachedInstanceError")
            else:
                at_least_one_attached_attribute = True
        if at_least_one_attached_attribute:
            return f"<{self.__class__.__name__}({','.join(field_strings)})>"
        return f"<{self.__class__.__name__} {id(self)}>"


class Account(Base, BaseModel):
    """User account"""

    __tablename__ = "accounts"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    token = Column(String)

    def __repr__(self):
        return self._repr(id=self.id, name=self.name, token=self.token)


class Dump(Base, BaseModel):
    """Dump"""

    __tablename__ = "dumps"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    elements = relationship("DumpElement", back_populates="dump")

    def __repr__(self):
        return self._repr(
            id=self.id,
            name=self.name,
            created_at=self.created_at,
            updated_at=self.updated_at,
        )


class DumpElement(Base, BaseModel):
    """Dump element"""

    __tablename__ = "dump_elements"
    id = Column(Integer, primary_key=True)
    dump_id = Column(Integer, ForeignKey("dumps.id"))
    dump = relationship("Dump", back_populates="elements")
    name = Column(String)
    reference_type = Column(String)
    reference = Column(String)

    def __repr__(self):
        return self._repr(
            id=self.id,
            dump_id=self.dump_id,
            name=self.name,
            reference_type=self.reference_type,
            reference=self.reference,
        )
