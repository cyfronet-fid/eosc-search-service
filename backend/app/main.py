"""The FastAPI bootstrap"""

from fastapi import FastAPI

from app.generic.apis.default_api import router as DefaultApiRouter

app = FastAPI(
    title="Search Service",
    description="EOSC Search Service",
    version="1.0.0-alpha1",
)


@app.get("/")
async def root():
    """
    Hello World
    """
    return {"message": "Hello World"}


app.include_router(DefaultApiRouter)
