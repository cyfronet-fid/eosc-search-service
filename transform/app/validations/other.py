import logging
import re

logger = logging.getLogger(__name__)


def validate_date_basic_format(date: str) -> None:
    """
    Validates that a date string adheres to the basic 'YYYYMMDD' format.

    Parameters:
        date (str): The date string to be validated.

    Raises:
        ValueError: If the data string is not in the 'YYYYMMDD' format.
    """
    date_pattern = re.compile(r"^\d{8}$")
    if not date_pattern.match(date):
        error_msg = f"Invalid date format: {date}. Use the format 'YYYYMMDD'."
        logger.error(error_msg)
        raise ValueError(error_msg)
