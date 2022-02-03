# pylint: disable=missing-module-docstring,missing-function-docstring
from fastapi import APIRouter

from app.schemas.category_response import CategoryResponse
from app.schemas.filter_response import FilterNodeResponse, FilterResponse
from app.schemas.label_response import LabelResponse
from app.schemas.resource_response import ResourceResponse
from app.schemas.search_result_response import SearchResultResponse

router = APIRouter()


@router.get("/search-results")
async def search_results():
    return [SearchResultResponse(label="Categories > category", value="category")]


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


@router.get("/filters")
async def filters():
    return [
        FilterResponse(
            label="scientific domains",
            field="scientific_domains",
            collection="resources",
            nodes=[
                FilterNodeResponse(title="Generic", key="generic", isLeaf=True),
                FilterNodeResponse(
                    title="Natural sciences",
                    key="natural-sciences",
                    expanded=True,
                    children=[
                        FilterNodeResponse(
                            title="Earth & Related Environmental Sciences",
                            key="earth-and-related-environmental-sciences",
                            isLeaf=True,
                        ),
                        FilterNodeResponse(
                            title="Biological Sciences",
                            key="biological-sciences",
                            isLeaf=True,
                        ),
                        FilterNodeResponse(
                            title="Chemical sciences",
                            key="chemical-sciences",
                            isLeaf=True,
                        ),
                    ],
                ),
            ],
        )
    ]


@router.get("/recommendations")
async def recommendations():
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
