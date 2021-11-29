"""DB connection and operations"""

from sqlalchemy import create_engine, select
from sqlalchemy.orm import selectinload, sessionmaker

from app.generic.models.dump import Dump as DumpModel
from app.generic.models.dump_elements import DumpElements as DumpElementModel

from .config import DATABASE_URI
from .models import Dump

engine = create_engine(DATABASE_URI, future=True, echo=True)

Session = sessionmaker(engine)


def select_dumps():
    """
    Select all Dumps and its DumpElements, and return its API mapping.
    """
    with Session() as session:
        stmt = (
            select(Dump)
            .options(selectinload(Dump.elements))
            .order_by(Dump.created_at.desc())
        )
        dumps = session.execute(stmt).scalars().all()

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
