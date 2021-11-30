"""Application configuration"""

import os

DATABASE_URI = os.getenv(
    "DATABASE_URI", "postgresql+psycopg2://ess:ess@localhost:5442/ess"
)
