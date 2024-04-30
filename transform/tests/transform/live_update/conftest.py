import json
from typing import Callable, Dict
from unittest.mock import MagicMock

import pytest
from pytest_mock import MockerFixture


class MockDependencies:
    def __init__(self, mocker: MockerFixture):
        """Initialize with patches"""
        self.transform_batch = mocker.patch(
            "app.transform.live_update.training_ig.transform_batch.delay"
        )
        self.delete_data_by_id = mocker.patch(
            "app.transform.live_update.training_ig.delete_data_by_id.delay"
        )
        self.check_document_exists = mocker.patch(
            "app.transform.live_update.training_ig.check_document_exists",
            return_value=True,
        )
        self.logger_info = mocker.patch(
            "app.transform.live_update.training_ig.logger.info"
        )


@pytest.fixture
def mock_dependencies(mocker: MockerFixture) -> MockDependencies:
    """Provides enhanced mocking capabilities with direct access to mocked methods."""
    return MockDependencies(mocker)


@pytest.fixture
def frame_factory() -> Callable[[str, str, Dict], MagicMock]:
    """Creates a frame object using the given parameters, simulating messaging headers and body."""

    def _frame(action: str, raw_collection: str, body_dict: Dict) -> MagicMock:
        print({"destination": f"topic/{raw_collection}.{action}"})
        return MagicMock(
            headers={"destination": f"topic/{raw_collection}.{action}"},
            body=json.dumps(body_dict),
        )

    return _frame


@pytest.fixture
def training_resource() -> Dict:
    """Provides a mock training resource with predefined attributes for testing."""
    return {
        "accessRights": "tr_access_right-metadata_only_access",
        "alternativeIdentifiers": [{"type": "EOSC PID", "value": "3c9d300c"}],
        "authors": ["test"],
        "catalogueId": "eosc",
        "contact": {
            "email": "test@test.com",
            "firstName": "Test",
            "lastName": "Test",
            "organisation": None,
            "phone": "",
            "position": None,
        },
        "contentResourceTypes": [],
        "description": "test",
        "duration": None,
        "eoscRelatedServices": [],
        "expertiseLevel": "tr_expertise_level-advanced",
        "geographicalAvailabilities": ["EO"],
        "id": "eosc.wf.2d96101266fbfe477732e5ce04d0f110",
        "keywords": [],
        "languages": ["en"],
        "learningOutcomes": ["Test"],
        "learningResourceTypes": [],
        "license": "test",
        "qualifications": [],
        "resourceOrganisation": "eosc.wf",
        "resourceProviders": [],
        "scientificDomains": [
            {
                "scientificDomain": "scientific_domain-other",
                "scientificSubdomain": "scientific_subdomain-other-other",
            }
        ],
        "targetGroups": ["target_user-businesses"],
        "title": "0_NEW_TEST_0",
        "url": "https://www.test.com",
        "urlType": None,
        "versionDate": 1709596800000,
    }


@pytest.fixture
def interoperability_guideline_resource() -> Dict:
    """Provides a mock resource related to interoperability guidelines for testing."""
    return {
        "alternativeIdentifiers": [
            {"type": "00_test_00", "value": "00_test_00"},
            {"type": "EOSC PID", "value": "d4e59173"},
        ],
        "catalogueId": "eosc",
        "created": "1715065184415",
        "creators": [
            {
                "creatorAffiliationInfo": {
                    "affiliation": "00_test_00",
                    "affiliationIdentifier": "00_test_00",
                },
                "creatorNameTypeInfo": {
                    "creatorName": "Test",
                    "nameType": "ir_name_type-personal",
                },
                "familyName": "Test",
                "givenName": "Test",
                "nameIdentifier": "00_test_00",
            }
        ],
        "description": "00_test_00",
        "domain": "scientific_domain-agricultural_sciences",
        "eoscGuidelineType": "ir_eosc_guideline_type-eosc_core_interoperability_guideline",
        "eoscIntegrationOptions": ["00_test_00"],
        "id": "eosc.b3f181d889c35a6b4cceeefb57f88ee4",
        "identifierInfo": {
            "identifier": "00_test_00",
            "identifierType": "ir_identifier_type-doi",
        },
        "providerId": "eosc.wf",
        "publicationYear": 2024,
        "relatedStandards": [
            {"relatedStandardIdentifier": None, "relatedStandardURI": None}
        ],
        "resourceTypesInfo": [
            {
                "resourceType": "00_test_00",
                "resourceTypeGeneral": "ir_resource_type_general-guideline",
            }
        ],
        "rights": [
            {
                "rightIdentifier": "CC-BY-3.0",
                "rightTitle": "00_test_00",
                "rightURI": "https://www.testcom",
            }
        ],
        "status": "ir_status-candidate",
        "title": "00_test_00",
        "updated": "1715065184415",
    }
