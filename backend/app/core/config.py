import sys
from typing import Any, Dict, List, Optional

from pydantic import BaseSettings, HttpUrl, PostgresDsn, validator
from pydantic.networks import AnyHttpUrl


class Settings(BaseSettings):

    PROJECT_NAME: str = "EOSC Search Service"

    SENTRY_DSN: Optional[HttpUrl] = None

    API_PATH: str = "/api/v1"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 7 * 24 * 60  # 7 days

    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    # The following variables need to be defined in environment

    TEST_DATABASE_URL: Optional[PostgresDsn]
    DATABASE_URL: PostgresDsn

    @validator("DATABASE_URL", pre=True)
    def build_test_database_url(cls, v: Optional[str], values: Dict[str, Any]):
        if "pytest" in sys.modules:
            if not values.get("TEST_DATABASE_URL"):
                raise Exception(
                    "pytest detected, but TEST_DATABASE_URL is not set in environment"
                )
            return values["TEST_DATABASE_URL"]
        return v

    SECRET_KEY: str
    #  END: required environment variables


settings = Settings()
