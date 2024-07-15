# pylint: disable=duplicate-code
"""Guideline expected input schema"""

guideline_input_schema = {
    "alternativeIdentifiers": ["list"],
    "catalogueId": ["str"],
    "created": ["str"],
    "creators": ["list"],
    "description": ["str"],
    "domain": ["str"],
    "eoscGuidelineType": ["str"],
    "eoscIntegrationOptions": ["list"],
    "id": ["str"],
    "identifierInfo": ["dict"],
    "providerId": ["str"],
    "publicationYear": ["int"],
    "relatedStandards": ["list"],
    "resourceTypesInfo": ["list"],
    "rights": ["list"],
    "status": ["str"],
    "title": ["str"],
    "updated": ["str"],
}
