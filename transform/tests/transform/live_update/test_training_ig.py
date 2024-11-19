import json
from typing import Any, Callable, Dict, Optional, Type
from unittest.mock import MagicMock

import pytest

from app.settings import settings
from app.transform.live_update.training_ig import (
    extract_data_from_frame,
    handle_create_action,
    handle_delete_action,
    handle_update_action,
    process_message,
)
from schemas.properties.data import ID
from tests.transform.live_update.conftest import MockDependencies


@pytest.mark.parametrize(
    "action, frame_body, expected_function, expected_exception",
    [
        # Scenarios for create, update, delete
        (
            "create",
            {
                "active": True,
                "suspended": False,
                "status": "approved resource",
            },
            "transform_batch.delay",
            None,
        ),
        (
            "update",
            {
                "active": True,
                "suspended": False,
                "status": "approved resource",
            },
            "transform_batch.delay",
            None,
        ),
        (
            "delete",
            {
                "active": True,
                "suspended": False,
                "status": "approved resource",
            },
            "delete_data_by_id.delay",
            None,
        ),
        # Scenario for incomplete frame
        ("create", {}, None, KeyError),
    ],
)
def test_process_message_variations(
    mock_dependencies: MockDependencies,
    frame_factory: Callable[[str, str, Dict], MagicMock],
    action: str,
    frame_body: Dict[str, Any],
    expected_function: Optional[str],
    expected_exception: Optional[Type[BaseException]],
    training_resource: Dict[str, Any],
) -> None:
    """Test variations of message processing with different actions and outcomes"""
    if frame_body:
        frame_body["trainingResource"] = training_resource
    frame = frame_factory(action, "training_resource", frame_body)

    if expected_exception:
        with pytest.raises(expected_exception):
            process_message(frame)
    else:
        process_message(frame)
        if expected_function == "transform_batch.delay":
            mock_dependencies.transform_batch.assert_called_once()
        elif expected_function == "delete_data_by_id.delay":
            mock_dependencies.delete_data_by_id.assert_called_once()


@pytest.mark.parametrize(
    "active, suspended, status, expected_call_count, expected_full_update",
    [
        (True, False, "approved resource", 1, False),  # Active and not suspended
        (False, False, "approved resource", 0, None),  # Inactive and not suspended
        (False, True, "approved resource", 0, None),  # Inactive and suspended
        (True, True, "approved resource", 0, None),  # Active and suspended
        (True, False, "pending approval", 0, None),  # Unapproved status
    ],
)
def test_handle_create_action_variations(
    mock_dependencies: MockDependencies,
    training_resource: Dict,
    active: bool,
    suspended: bool,
    status: str,
    expected_call_count: int,
    expected_full_update: Optional[bool],
) -> None:
    """Test create action handling under various conditions."""
    handle_create_action(
        active,
        suspended,
        status,
        settings.TRAINING,
        training_resource,
        training_resource[ID],
    )

    if expected_call_count == 1:
        mock_dependencies.transform_batch.assert_called_once_with(
            settings.TRAINING, training_resource, full_update=expected_full_update
        )
    else:
        mock_dependencies.transform_batch.assert_not_called()


@pytest.mark.parametrize(
    "active, suspended, status, exists, should_update, should_delete",
    [
        (
            True,
            False,
            "approved resource",
            True,
            True,
            False,
        ),  # Active and not suspended
        (
            False,
            False,
            "approved resource",
            True,
            False,
            True,
        ),  # Inactive and not suspended
        (False, True, "approved resource", True, False, True),  # Inactive and suspended
        (True, True, "approved resource", True, False, True),  # Active and suspended
        (True, False, "pending approval", True, False, True),  # Unapproved status
        (False, False, "approved resource", False, False, False),  # Does not exist
    ],
)
def test_handle_update_action_variations(
    mock_dependencies: MockDependencies,
    training_resource: Dict,
    active: bool,
    suspended: bool,
    status: str,
    exists: bool,
    should_update: bool,
    should_delete: bool,
) -> None:
    """Test update action handling based on resource state and existence."""
    mock_dependencies.check_document_exists.return_value = exists
    handle_update_action(
        active,
        suspended,
        status,
        settings.TRAINING,
        training_resource,
        training_resource[ID],
    )
    if should_update:
        mock_dependencies.transform_batch.assert_called_once()
    elif should_delete:
        mock_dependencies.delete_data_by_id.assert_called_once()
    else:
        mock_dependencies.transform_batch.assert_not_called()
        mock_dependencies.delete_data_by_id.assert_not_called()


@pytest.mark.parametrize("exists", [True, False])  # Does exist, Does not exist
def test_handle_delete_action_variations(
    mock_dependencies: MockDependencies, training_resource: Dict, exists: bool
) -> None:
    """Test delete action handling based on resource existence."""
    mock_dependencies.check_document_exists.return_value = exists
    handle_delete_action(settings.TRAINING, training_resource[ID], training_resource)
    if exists:
        mock_dependencies.delete_data_by_id.assert_called_once()
    else:
        mock_dependencies.delete_data_by_id.assert_not_called()


@pytest.mark.parametrize(
    "raw_collection, collection_key",
    [
        ("training_resource", "trainingResource"),
        ("interoperability_record", "interoperabilityRecord"),
        ("unknown", None),
    ],
)
def test_extract_data_from_frame(
    raw_collection: str,
    collection_key: Optional[str],
    training_resource: Dict,
    interoperability_guideline_resource: Dict,
) -> None:
    """Extract and return data from a frame based on collection key."""
    frame_body = {}
    if collection_key == "trainingResource":
        frame_body[collection_key] = training_resource
    elif collection_key == "interoperabilityRecord":
        frame_body[collection_key] = interoperability_guideline_resource

    collection, data, data_id = extract_data_from_frame(raw_collection, frame_body)

    if raw_collection == "training_resource":
        assert collection == settings.TRAINING
        assert data == training_resource
        assert data_id == training_resource[ID]
    elif raw_collection == "interoperability_record":
        assert collection == settings.GUIDELINE
        assert data == [interoperability_guideline_resource]
        assert data_id == interoperability_guideline_resource[ID]
    else:
        assert collection == "unknown"
        assert data is None
        assert data_id is None


def test_process_message_malformed_json() -> None:
    """Test message processing handling for malformed JSON in the body."""
    frame = MagicMock(
        headers={"destination": "topic/training_resource/create"}, body="{not: 'json'}"
    )
    with pytest.raises(json.JSONDecodeError):
        process_message(frame)
