import json
import logging
from datetime import datetime
from pathlib import Path

from app.logger import LOG_FILE_NAME

logger = logging.getLogger(__name__)

log_directory = Path(LOG_FILE_NAME).resolve().parent


def save_error_log_to_json(error_log: dict) -> None:
    """Saves error log dictionary to JSON files, one per collection with errors."""
    if not log_directory.exists():
        logger.error("Log directory %s does not exist", log_directory)
        return

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    timestamped_directory = log_directory / timestamp
    timestamped_directory.mkdir(parents=True, exist_ok=True)

    for collection, errors in error_log.items():
        if errors:
            try:
                filename = timestamped_directory / f"{collection}_errors.json"
                with open(filename, "w") as f:
                    json.dump(errors, f, indent=4)
                logger.info("Saved errors for %s to %s", collection, filename)
            except Exception as e:
                logger.error("Failed to save error log for %s: %s", collection, e)
