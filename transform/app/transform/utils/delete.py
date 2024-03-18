import logging
import os

logger = logging.getLogger(__name__)


def remove_files(path):
    """Removes all files and directories within the specified path"""
    for root, dirs, files in os.walk(path):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                os.remove(file_path)
            except OSError as e:
                logger.exception(f"Failed to delete file {file_path}. Reason: {e}")
        for dir_ in dirs:
            dir_path = os.path.join(root, dir_)
            try:
                os.rmdir(dir_path)
            except OSError as e:
                logger.exception(f"Failed to delete directory {dir_path}. Reason: {e}")
