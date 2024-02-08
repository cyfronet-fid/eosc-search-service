# pylint: disable=missing-module-docstring,missing-function-docstring,unused-argument
import datetime
from unittest import mock

import pytest

from app.solr.utils import parse_organisation_filters, parse_project_filters


class MockedDate(datetime.date):
    """Mocked datetime.today"""

    @classmethod
    def today(cls):
        return cls(2024, 2, 6)


@pytest.mark.parametrize(
    "original_fq, expected",
    [
        (
            ['project_status:("closed")'],
            ["{!field f=date_range op=Within}[* TO 2024-02-05]"],
        ),
        (
            ['project_status:("ongoing")'],
            ["{!field f=date_range op=Contains}[2024-02-06 TO 2024-02-06]"],
        ),
        (
            ['project_status:("ongoing" OR "closed")'],
            ["{!field f=date_range}[* TO 2024-02-06]"],
        ),
        (
            [
                (
                    'related_organisation_titles:("French National Centre for'
                    ' Scientific Research")'
                ),
                (
                    'funding_stream_title:("Horizon 2020 Framework Programme \\-'
                    ' Research and Innovation action")'
                ),
            ],
            [
                (
                    'related_organisation_titles:("French National Centre for'
                    ' Scientific Research")'
                ),
                (
                    'funding_stream_title:("Horizon 2020 Framework Programme \\-'
                    ' Research and Innovation action")'
                ),
            ],
        ),
        (
            [
                (
                    'funding_stream_title:("Horizon 2020 Framework Programme \\-'
                    ' Research and Innovation action")'
                ),
                'project_status:("ongoing")',
            ],
            [
                (
                    'funding_stream_title:("Horizon 2020 Framework Programme \\-'
                    ' Research and Innovation action")'
                ),
                "{!field f=date_range op=Contains}[2024-02-06 TO 2024-02-06]",
            ],
        ),
    ],
)
@mock.patch("app.solr.utils.date", MockedDate)
def test_parse_project_filters(monkeypatch, original_fq, expected):
    datetime.today = MockedDate.today()
    result_fq = parse_project_filters(original_fq)
    assert result_fq == expected


@pytest.mark.parametrize(
    "original_fq, expected",
    [
        (
            ['country:("United Kingdom" OR "India")'],
            ['country:("United Kingdom" OR "India")'],
        ),
        (
            ['related_resources:("dataset")', 'country:("United Kingdom" OR "India")'],
            ['country:("United Kingdom" OR "India")', "related_dataset_ids:(*)"],
        ),
        (
            [
                'related_resources:("publication" OR "dataset")',
                'country:("United Kingdom" OR "India")',
            ],
            [
                'country:("United Kingdom" OR "India")',
                "related_publication_ids:(*) OR related_dataset_ids:(*)",
            ],
        ),
        (
            ['related_resources:("publication" OR "dataset")'],
            ["related_publication_ids:(*) OR related_dataset_ids:(*)"],
        ),
    ],
)
def test_parse_organisation_filters(original_fq, expected):
    result_fq = parse_organisation_filters(original_fq)
    assert result_fq == expected
