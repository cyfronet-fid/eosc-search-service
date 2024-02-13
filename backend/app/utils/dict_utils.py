# pylint: disable=missing-module-docstring, missing-function-docstring
from typing import Any, Dict, List


def deep_merge(source, destination) -> Dict[str, Any]:
    for key, value in source.items():
        if isinstance(value, dict):
            node = destination.setdefault(key, {})
            deep_merge(value, node)
        else:
            destination[key] = value

    return destination


def truncate_dict(data: Dict[str, Any], permitted_keys: List[str]) -> Dict[str, Any]:
    """
    permitted is a list of alphabetic string with allowed '.' char
    "." separate nested fields names

    Example: user.personal-data.name, user.additional-info.job-type
    """
    truncated_data = data.copy()
    for key, value in data.items():
        if not has_permission(key, permitted_keys):
            del truncated_data[key]
            continue

        if not isinstance(value, dict) and not is_nested(key, permitted_keys):
            continue

        truncated_data[key] = truncate_dict(
            truncated_data[key], children_of(key, permitted_keys)
        )

    return truncated_data


def has_permission(key: str, permitted_keys: List[str]) -> bool:
    for permitted_key in permitted_keys:
        if key in permitted_key:
            return True

    return False


def is_nested(key: str, permitted_keys: List[str]) -> bool:
    for permitted_key in permitted_keys:
        if key in permitted_key:
            return "." in permitted_key

    return False


def children_of(key: str, permitted_keys: List[str]) -> List[str]:
    return [
        permitted_key.replace(f"{key}.", "")
        for permitted_key in permitted_keys
        if key in permitted_key and not key == permitted_key
    ]


def permitted_keys_of(keys: List[str], permitted_keys: List[str]) -> List[str]:
    return [key for key in keys if key in permitted_keys]


def dict_to_keys(source: Dict[str, Any], prefix="") -> List[str]:
    keys = []
    for key, value in source.items():
        if not isinstance(value, dict):
            keys.append(new_prefix(key, prefix))
            continue

        keys.extend(dict_to_keys(source[key], new_prefix(key, prefix)))

    return keys


def new_prefix(key: str, current_prefix: str | None) -> str:
    return f"{current_prefix}.{key}" if current_prefix else key


def same_keys_of(source: List[str], destination: List[str]) -> List[str]:
    return [key for key in source if key in destination]


def new_keys_of(source: List[str], destination: List[str]) -> List[str]:
    return [key for key in source if key not in destination]
