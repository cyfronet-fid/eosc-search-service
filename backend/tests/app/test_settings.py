# pylint: disable=missing-module-docstring,missing-function-docstring
import pytest
from pydantic import ValidationError

from app.settings import GlobalSettings


def make_settings(**values) -> GlobalSettings:
    return GlobalSettings(_env_file=None, **values)


def test_matomo_is_off_by_default():
    settings = make_settings()

    assert settings.MATOMO_ENABLED is False
    assert settings.MATOMO_URL is None
    assert settings.MATOMO_SITE_ID is None


@pytest.mark.parametrize(
    "values, missing",
    [
        ({"MATOMO_SITE_ID": 3}, "MATOMO_URL"),
        ({"MATOMO_URL": "https://matomo.example.org/"}, "MATOMO_SITE_ID"),
        ({}, "MATOMO_URL"),
    ],
)
def test_matomo_on_without_url_or_site_id_fails_startup(values, missing):
    with pytest.raises(ValidationError, match=missing):
        make_settings(MATOMO_ENABLED=True, **values)


@pytest.mark.parametrize(
    "url, expected",
    [
        ("https://matomo.example.org", "https://matomo.example.org/"),
        ("https://example.org/matomo", "https://example.org/matomo/"),
        ("https://example.org/matomo/", "https://example.org/matomo/"),
    ],
)
def test_matomo_url_gets_a_trailing_slash(url, expected):
    settings = make_settings(MATOMO_URL=url)

    assert settings.MATOMO_URL == expected


def test_matomo_url_must_be_absolute():
    with pytest.raises(ValidationError, match="MATOMO_URL"):
        make_settings(MATOMO_URL="matomo.example.org/matomo")
