# pylint: disable=missing-module-docstring
import logging
from logging.config import dictConfig

from app.log_config import LogConfig

dictConfig(LogConfig().dict())
logger = logging.getLogger("ess")
