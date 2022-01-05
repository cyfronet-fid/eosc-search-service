"""Application configuration"""

import os

IS_TESTING = os.getenv("TESTING") == "1"

DATABASE_URI = (
    "postgresql+psycopg2://ess_test:ess_test@localhost:5452/ess_test"
    if IS_TESTING
    else os.getenv("DATABASE_URI", "postgresql+psycopg2://ess:ess@localhost:5442/ess")
)

SOLR_URL = os.getenv("SOLR_URL", "http://localhost:8983/solr/")
