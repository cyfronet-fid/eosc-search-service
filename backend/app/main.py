"""The FastAPI bootstrap"""

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    """
    Hello World
    """
    return {"message": "Hello World"}
