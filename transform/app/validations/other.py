import logging
import re
from datetime import datetime

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

    try:
        datetime.strptime(date, "%Y%m%d")
    except ValueError:
        error_msg = (
            f"Invalid date: {date[:4]}-{date[4:6]}-{date[-2:]}. Not a valid date."
        )
        logger.error(error_msg)
        raise ValueError(error_msg)
