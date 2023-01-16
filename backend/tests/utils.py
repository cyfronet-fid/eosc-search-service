# pylint: disable=wrong-import-order

"""Utils used in testing. Should contain importable entities"""

import dataclasses
from uuid import UUID

from app.schemas.session_data import SessionData


@dataclasses.dataclass
class UserSession:
    """UserSession data - contains memory backend id and session data"""

    backend_session_id: UUID
    session_data: SessionData
