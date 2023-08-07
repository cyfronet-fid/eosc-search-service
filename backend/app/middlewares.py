# pylint: disable=too-few-public-methods
"""
API middlewares on different hooks
"""
import logging
from typing import Awaitable, Callable
from uuid import uuid4

from starlette.concurrency import iterate_in_threadpool
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, StreamingResponse

from app.settings import settings
from app.utils.logger import logger


class LogRequestsMiddleware(BaseHTTPMiddleware):
    """
    Requests and its responses logger containing
    - headers
    - cookies
    - referer
    - path
    """

    async def dispatch(
        self,
        request: Request,
        call_next: Callable[[Request], Awaitable[StreamingResponse]],
    ) -> Response:
        # REQUEST
        uuid = uuid4()
        if settings.LOG_LEVEL == logging.getLevelName(logging.DEBUG):
            referer = request.headers["referer"] if "referer" in request.headers else ""
            logger.debug(
                (
                    "\n\nREQUEST:\n\n id=%s\n path=%s\n referer=%s\n cookies=%s\n"
                    " headers=%s\n\n"
                ),
                uuid,
                request.url.path,
                referer,
                request.cookies,
                request.headers,
            )

        # RESPONSE
        response = await call_next(request)
        if settings.LOG_LEVEL == logging.getLevelName(logging.DEBUG):
            response_body = [section async for section in response.body_iterator]
            response.body_iterator = iterate_in_threadpool(iter(response_body))

            body = response_body[0].decode() if len(response_body) > 0 else "''"
            logger.debug(
                "\n\nRESPONSE:\n\n id=%s\n status_code=%s\n body=%s\n headers=%s\n\n",
                uuid,
                response.status_code,
                body,
                response.headers,
            )

        return response
