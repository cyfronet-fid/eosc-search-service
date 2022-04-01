"""A dumps repository"""

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.repositories.base import BaseRepository
from app.generic.models.dump import Dump as DumpModel
from app.generic.models.dump_elements import DumpElements as DumpElementModel
from app.models import Dump


class DumpsRepository(BaseRepository):
    """All database actions associated with Dumps"""

    def create_dump(self, *, new_dump: Dump):
        """Creates a new Dump"""
        self.db.add(new_dump)
        self.db.commit()

    def list_all_dumps(self) -> list[DumpModel]:
        """
        Select all Dumps and its DumpElements, and return its API mapping.
        """
        stmt = (
            select(Dump)
            .options(selectinload(Dump.elements))
            .order_by(Dump.created_at.desc())
        )
        dumps = self.db.execute(stmt).scalars().all()

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
