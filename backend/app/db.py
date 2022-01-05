"""DB connection and operations"""
from typing import List

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, selectinload, sessionmaker

from app.config import DATABASE_URI
from app.generic.models.dump import Dump as DumpModel
from app.generic.models.dump_elements import DumpElements as DumpElementModel
from app.models import Dump

engine = create_engine(DATABASE_URI, future=True, echo=True)

SessionLocal = sessionmaker(engine)


def select_dumps(db: Session) -> List[DumpModel]:
    """
    Select all Dumps and its DumpElements, and return its API mapping.
    """
    stmt = (
        select(Dump)
        .options(selectinload(Dump.elements))
        .order_by(Dump.created_at.desc())
    )
    dumps = db.execute(stmt).scalars().all()

    out = []
    for dump in dumps:
        elements = []
        for element in sorted(dump.elements, key=lambda e: e.name):
            elements.append(
                DumpElementModel(
                    name=element.name,
                    reference_type=element.reference_type,
                    reference=element.reference,
                )
            )
        out.append(
            DumpModel(
                name=dump.name,
                created_at=dump.created_at.isoformat() + "Z",
                updated_at=dump.updated_at.isoformat() + "Z",
                elements=elements,
            )
        )
    return out
