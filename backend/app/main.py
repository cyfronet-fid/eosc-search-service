"""The FastAPI bootstrap"""

from fastapi import FastAPI

from app.generic.apis.default_api import router as generic_router

from .apis import internal_api_router

app = FastAPI(
    title="Search Service",
    description="EOSC Search Service",
    version="1.0.0-alpha1",
)


app.include_router(router=generic_router, prefix="/v1")
app.include_router(router=internal_api_router, prefix="/internal")
