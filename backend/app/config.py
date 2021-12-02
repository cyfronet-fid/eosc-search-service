"""Application configuration"""

import os

DATABASE_URI = os.getenv(
    "DATABASE_URI", "postgresql+psycopg2://ess:ess@localhost:5442/ess"
)

SOLR_URL = os.getenv("SOLR_URL", "http://localhost:8983/solr/")
