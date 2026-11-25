# pylint: disable=too-few-public-methods
"""Error tracking (Sentry) of the hub"""

from typing import Optional
from urllib.parse import urlparse

import sentry_sdk

from app.settings import GlobalSettings, settings


class SentryContext:
    """The Sentry values that the settings give.

    All hubs and all instances report to one Sentry project. The tags
    `variant`, `instance` and `component` tell the events apart.
    """

    def __init__(self, app_settings: GlobalSettings):
        self._settings = app_settings

    @property
    def enabled(self) -> bool:
        """Sentry is on only when SENTRY_DSN has a value."""
        return bool(self._settings.SENTRY_DSN)

    @property
    def dsn(self) -> Optional[str]:
        """The DSN of the Sentry project."""
        return self._settings.SENTRY_DSN

    @property
    def environment(self) -> str:
        """The Sentry environment, default: the environment of the hub."""
        return self._settings.SENTRY_ENVIRONMENT or self._settings.ENVIRONMENT

    @property
    def release(self) -> Optional[str]:
        """The release of the events: the commit of the deploy."""
        return self._settings.SENTRY_RELEASE

    @property
    def traces_sample_rate(self) -> float:
        """The share of the requests stored as transactions."""
        return self._settings.SENTRY_TRACES_SAMPLE_RATE

    def tags(self, component: str) -> dict[str, str]:
        """The tags of the events of one component. A tag without a value
        is not sent."""
        tags = {
            "variant": self._settings.SENTRY_VARIANT,
            "instance": urlparse(self._settings.UI_BASE_URL).hostname,
            "component": component,
        }
        return {name: value for name, value in tags.items() if value}


class ApiSentry:
    """Sentry of the API process."""

    COMPONENT = "api"

    def __init__(self, context: SentryContext):
        self._context = context

    def start(self) -> None:
        """Start the Sentry SDK and set the tags for all events of the
        process."""
        if not self._context.enabled:
            return

        sentry_sdk.init(
            dsn=self._context.dsn,
            environment=self._context.environment,
            release=self._context.release,
            traces_sample_rate=self._context.traces_sample_rate,
        )
        sentry_sdk.get_global_scope().set_tags(
            self._context.tags(self.COMPONENT)
        )


sentry_context = SentryContext(settings)
