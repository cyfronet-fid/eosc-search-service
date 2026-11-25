# pylint: disable=missing-module-docstring,missing-function-docstring
from pytest_mock import MockerFixture

from app.sentry import ApiSentry, SentryContext
from app.settings import GlobalSettings

DSN = "https://key@sentry.test/1"


def make_context(**values) -> SentryContext:
    return SentryContext(GlobalSettings(_env_file=None, **values))


def test_context_is_off_without_dsn() -> None:
    assert make_context(SENTRY_DSN=None).enabled is False


def test_context_is_on_with_dsn() -> None:
    assert make_context(SENTRY_DSN=DSN).enabled is True


def test_environment_default_is_the_hub_environment() -> None:
    context = make_context(SENTRY_ENVIRONMENT=None, ENVIRONMENT="dev")

    assert context.environment == "dev"


def test_environment_from_sentry_environment() -> None:
    context = make_context(SENTRY_ENVIRONMENT="staging", ENVIRONMENT="dev")

    assert context.environment == "staging"


def test_tags_of_a_component() -> None:
    context = make_context(
        SENTRY_VARIANT="dh", UI_BASE_URL="https://search.test:8443/"
    )

    assert context.tags("api") == {
        "variant": "dh",
        "instance": "search.test",
        "component": "api",
    }


def test_variant_default_is_ess() -> None:
    context = make_context(UI_BASE_URL="https://search.test/")

    assert context.tags("api") == {
        "variant": "ess",
        "instance": "search.test",
        "component": "api",
    }


def test_api_sentry_does_not_start_without_dsn(mocker: MockerFixture) -> None:
    init = mocker.patch("app.sentry.sentry_sdk.init")

    ApiSentry(make_context(SENTRY_DSN=None)).start()

    init.assert_not_called()


def test_api_sentry_starts_the_sdk_with_tags(mocker: MockerFixture) -> None:
    init = mocker.patch("app.sentry.sentry_sdk.init")
    scope = mocker.patch("app.sentry.sentry_sdk.get_global_scope").return_value
    context = make_context(
        SENTRY_DSN=DSN,
        SENTRY_ENVIRONMENT="staging",
        SENTRY_RELEASE="abc123",
        SENTRY_VARIANT="ess",
        SENTRY_TRACES_SAMPLE_RATE=0.5,
        UI_BASE_URL="https://search.test/",
    )

    ApiSentry(context).start()

    init.assert_called_once_with(
        dsn=DSN,
        environment="staging",
        release="abc123",
        traces_sample_rate=0.5,
    )
    scope.set_tags.assert_called_once_with(
        {
            "variant": "ess",
            "instance": "search.test",
            "component": "api",
        }
    )
