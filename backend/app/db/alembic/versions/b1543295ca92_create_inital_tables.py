# pylint: disable=invalid-name, missing-function-docstring, no-member
"""create user data

Revision ID: b1543295ca92
Revises:
Create Date: 2024-02-12 09:39:21.963817

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
from sqlalchemy.dialects import postgresql

revision = "b1543295ca92"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "user",
        sa.Column("aaiId", sa.String, primary_key=True),
        sa.Column("provider", sa.Boolean, default=False, nullable=False),
        sa.Column("admin", sa.Boolean, default=False, nullable=False),
        sa.Column("superAdmin", sa.Boolean, default=False, nullable=False),
    )
    op.create_table(
        "user_data",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("userId", sa.String, nullable=False),
        sa.Column("data", postgresql.JSON, nullable=False),
    )
    op.create_table(
        "provider_rights",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("providerId", sa.String, nullable=False),
        sa.Column("read", postgresql.ARRAY(sa.String), nullable=True),
        sa.Column("write", postgresql.ARRAY(sa.String), nullable=True),
    )
    op.create_foreign_key(
        "fk_user_data_user",
        "user_data",
        "user",
        ["userId"],
        ["aaiId"],
    )
    op.create_foreign_key(
        "fk_provider_rights_user",
        "provider_rights",
        "user",
        ["providerId"],
        ["aaiId"],
    )


def downgrade() -> None:
    op.drop_table("user")
    op.drop_table("user_data")
    op.drop_table("user_data_rights")
