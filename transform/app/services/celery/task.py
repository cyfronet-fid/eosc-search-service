"""Schema for what a celery task should return"""

from typing import Any, Dict, Optional

from pydantic import BaseModel


class CeleryTaskStatus(BaseModel):
    """Celery return schema"""

    status: str = None
    reason: Optional[str] = None
    file_paths: Optional[Dict[str, Any]] = None
