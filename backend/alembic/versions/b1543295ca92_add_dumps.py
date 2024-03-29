"""Add dumps

Revision ID: b1543295ca92
Revises: f972407fc77d
Create Date: 2021-11-29 12:15:57.495584

"""

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "b1543295ca92"
down_revision = "f972407fc77d"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "dumps",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "dump_elements",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("dump_id", sa.Integer(), nullable=True),
        sa.Column("name", sa.String(), nullable=True),
        sa.Column("reference_type", sa.String(), nullable=True),
        sa.Column("reference", sa.String(), nullable=True),
        sa.ForeignKeyConstraint(
            ["dump_id"],
            ["dumps.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("dump_elements")
    op.drop_table("dumps")
    # ### end Alembic commands ###
