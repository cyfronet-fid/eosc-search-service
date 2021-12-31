"""Manage application from cmd"""

from datetime import datetime, timezone

import typer

from .db import Session
from .models import Dump, DumpElement

db_group = typer.Typer()


@db_group.command()
def seed_basic():
    """
    Seed with a basic data-set
    """
    with Session() as session:
        dump = Dump(
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
        session.add(dump)
        session.commit()


@db_group.command()
def seed_oag_1():
    """
    Seed with oag-1 data-set
    """
    s3_prefix = "https://ess-mock-dumps.s3.cloud.cyfronet.pl"
    with Session() as session:
        dump = Dump(
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
        session.add(dump)
        session.commit()


app = typer.Typer()
app.add_typer(db_group, name="db")


if __name__ == "__main__":
    app()