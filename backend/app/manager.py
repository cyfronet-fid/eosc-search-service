"""Manage application from cmd"""

from datetime import datetime, timezone

import typer

from .db.repositories.dumps import DumpsRepository
from .models import Dump, DumpElement
from .tasks import create_session_local

db_group = typer.Typer()


def create_dump(new_dump: Dump):
    """Create dump using a fresh DB session"""
    with create_session_local()() as db:
        dumps_repo = DumpsRepository(db)
        dumps_repo.create_dump(new_dump=new_dump)


@db_group.command()
def seed_basic():
    """
    Seed with a basic data-set
    """
    create_dump(
        new_dump=Dump(
            name="openaire_1",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            elements=[
                DumpElement(
                    name=f"file_{it}",
                    reference_type="s3:v1",
                    reference=f"https://ceph.endpoint/path_{it}",
                )
                for it in range(10)
            ],
        )
    )


@db_group.command()
def seed_oag_1():
    """
    Seed with oag-1 data-set
    """
    s3_prefix = "https://ess-mock-dumps.s3.cloud.cyfronet.pl"
    create_dump(
        Dump(
            name="oag_1",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            elements=[
                DumpElement(
                    name=f"file_{el_name}",
                    reference_type="s3:v1",
                    reference=f"{s3_prefix}/oag-1/{el_name}_0.csv",
                )
                for el_name in [
                    "datasets",
                    "otherresearchproducts",
                    "publications",
                    "software",
                    "organisations",
                    "projects",
                ]
            ],
        )
    )


@db_group.command()
def seed_oag_2():
    """
    Seed with oag-2 data-set
    """
    s3_prefix = "https://ess-mock-dumps.s3.cloud.cyfronet.pl"
    create_dump(
        Dump(
            name="oag_2",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            elements=[
                DumpElement(
                    name=f"file_{el_name}",
                    reference_type="s3:v1",
                    reference=f"{s3_prefix}/oag-2/openaire_prod_20211208/v2/{el_name}",
                )
                for el_name in [
                    "dataset/000550_0",
                    "dataset/v2/000550_0.jsonl",
                    "otherresearchproduct/000020_0",
                    "otherresearchproduct/v2/000020_0.jsonl",
                    "publication/000550_0",
                    "publication/v2/000550_0.jsonl",
                ]
            ],
        )
    )


app = typer.Typer()
app.add_typer(db_group, name="db")


if __name__ == "__main__":
    app()
