# pylint: disable=missing-module-docstring,missing-function-docstring
from fastapi import APIRouter

from app.schemas.category_response import CategoryResponse
from app.schemas.label_response import LabelResponse
from app.schemas.resource_response import ResourceResponse

router = APIRouter()


@router.get("/labels")
async def labels():
    return [
        LabelResponse(label="marketplace", count=148),
        LabelResponse(label="research outcomes", count=2053),
        LabelResponse(label="content providers", count=12243),
        LabelResponse(label="organisations", count=538),
        LabelResponse(label="knowledge hub", count=188),
    ]


@router.get("/categories")
async def categories():
    return [
        CategoryResponse(label="Access physical & einfrastructures", count=3),
        CategoryResponse(label="Aggregators & Integrators", count=12),
        CategoryResponse(label="Other", count=36),
    ]


@router.get("/recommended-resources")
async def recommended_resources():
    return [
        ResourceResponse(
            imgSrc="https://picsum.photos/150/150",
            label="Test",
            rating=3,
            description="Lorem ipsum",
            organisation="New organisation",
        ),
        ResourceResponse(
            imgSrc="https://picsum.photos/150/150",
            label="Test",
            rating=3,
            description="Lorem ipsum",
            organisation="New organisation",
        ),
        ResourceResponse(
            imgSrc="https://picsum.photos/150/150",
            label="Test",
            rating=3,
            description="Lorem ipsum",
            organisation="New organisation",
        ),
    ]
