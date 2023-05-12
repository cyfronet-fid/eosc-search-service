"""The FastAPI bootstrap"""
import requests
from fastapi import Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import APIRouter
from fastapi_utils.tasks import repeat_every
from app.worker import transform_batch
from app.transform.utils.loader import (
    ALL_COLLECTION,
    GUIDELINE,
    TRAINING,
    load_env_vars,
    ADDRESS,
)
from app.services.solr.delete import delete_data_by_type
from app.server import get_app

app = get_app()
app.mount("/app/web/static", StaticFiles(directory="app/web/static"), name="static")
templates = Jinja2Templates(directory="app/web/templates")
router = APIRouter()


@app.on_event("startup")
@repeat_every(seconds=60 * 60)  # 1h
@router.post("/cyclic_update")
async def cyclic_update():
    """Transform a single type of data - single or many records"""
    guideline_task_id = None
    training_task_id = None

    env_vars = load_env_vars()
    guidelines_address = env_vars[ALL_COLLECTION][GUIDELINE][ADDRESS]
    trainings_address = env_vars[ALL_COLLECTION][TRAINING][ADDRESS]

    try:
        # Get all guidelines & trainings
        guidelines = requests.get(guidelines_address, timeout=20).json()["results"]
        trainings = requests.get(trainings_address, timeout=20).json()["results"]

        if guidelines:
            # Clear current collection
            delete_data_by_type(GUIDELINE)
            # Transform & upload all resources
            guideline_task = transform_batch.delay(GUIDELINE, guidelines)
            guideline_task_id = guideline_task.id

        if trainings:
            delete_data_by_type(TRAINING)
            training_task = transform_batch.delay(TRAINING, trainings)
            training_task_id = training_task.id

    except Exception:
        return None

    return [{"guideline_task": guideline_task_id}, {"training_task": training_task_id}]


@app.get("/")
def home(request: Request):
    return templates.TemplateResponse("home.html", context={"request": request})


app.include_router(router, tags=["transform"])
