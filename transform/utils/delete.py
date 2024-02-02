import os
import shutil

from schemas.properties.data import TMP_DIRECTORY
from utils.utils import logger


def clean_tmp():
    """
    Deletes all files in the tmp directory.
    """
    for filename in os.listdir(TMP_DIRECTORY):
        file_path = os.path.join(TMP_DIRECTORY, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            logger.exception(f"Failed to delete {file_path}. Reason: {e}")
