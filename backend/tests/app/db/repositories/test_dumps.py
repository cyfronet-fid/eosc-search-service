# pylint: disable=missing-module-docstring,missing-function-docstring,redefined-outer-name
from datetime import datetime

import pytest
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.repositories.dumps import DumpsRepository
from app.models import Dump, DumpElement
from app.tasks import create_session_local


# pylint: disable=unused-argument
@pytest.fixture
def db(apply_migrations: None) -> Session:
    session_local = create_session_local()
    with session_local() as db:
        yield db


@pytest.fixture
def dumps_repo(db: Session) -> DumpsRepository:
    return DumpsRepository(db)


@pytest.fixture
def new_dump() -> Dump:
    return Dump(
        name="foo",
        created_at=datetime(2020, 10, 10),
        updated_at=datetime(2021, 10, 10),
        elements=[
            DumpElement(
                name="bar",
                reference_type="faz:v1",
                reference="bar_ref",
            ),
            DumpElement(
                name="baz",
                reference_type="far:v1",
                reference="ref_baz",
            ),
        ],
    )


@pytest.fixture
def another_dump() -> Dump:
    return Dump(
        name="bar",
        created_at=datetime(2020, 11, 10),
        updated_at=datetime(2021, 11, 10),
    )


@pytest.fixture
def create_dumps(db: Session, new_dump: Dump, another_dump: Dump) -> None:
    db.add(new_dump)
    db.add(another_dump)
    db.commit()


def test_create_dump(db: Session, dumps_repo: DumpsRepository, new_dump: Dump):
    assert db.query(Dump).count() == 0

    dumps_repo.create_dump(new_dump=new_dump)

    stmt = select(Dump).options(selectinload(Dump.elements))
    dumps = db.execute(stmt).scalars().all()

    assert len(dumps) == 1
    assert dumps[0].name == "foo"
    assert dumps[0].created_at == datetime(2020, 10, 10)
    assert dumps[0].updated_at == datetime(2021, 10, 10)
    assert len(dumps[0].elements) == 2


# pylint: disable=unused-argument
def test_list_all_dumps(db: Session, dumps_repo: DumpsRepository, create_dumps: None):
    assert db.query(Dump).count() == 2

    dumps = dumps_repo.list_all_dumps()

    assert len(dumps) == 2
