"""The FastAPI bootstrap"""
from fastapi import Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.server import get_app

app = get_app()
app.mount("/app/web/static", StaticFiles(directory="app/web/static"), name="static")
templates = Jinja2Templates(directory="app/web/templates")


@app.get("/")
def home(request: Request):
    return templates.TemplateResponse("home.html", context={"request": request})
