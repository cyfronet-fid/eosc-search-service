# pylint: disable=missing-function-docstring

""" Presentable items UI endpoint """
import datetime
import random
import uuid
from typing import Literal

import httpx
from fastapi import APIRouter, Depends

from app.config import RECOMMENDER_ENDPOINT, SOLR_URL
from app.generic.models.bad_request import BadRequest
from app.schemas.session_data import SessionData
from app.utils.cookie_validators import cookie, verifier

router = APIRouter()


@router.get(
    "/recommendations",
    dependencies=[Depends(cookie)],
    responses={500: {"model": BadRequest}},
)
async def get_recommendations(
    panel_id: Literal[
        "all", "publication", "datasets", "software", "training", "service"
    ],
    session: SessionData = Depends(verifier),
):
    panel_id_options = ["publication", "datasets", "software", "training"]

    page_id = "/search/" + panel_id
    panels = []
    if panel_id == "all":
        panel_id = panel_id_options[random.randrange(len(panel_id_options))]

    if panel_id == "publication":
        panels = ["publications"]
    elif panel_id == "datasets":
        panels = ["datasets"]
    elif panel_id == "software":
        panels = ["software"]
    elif panel_id == "training":
        panels = ["trainings"]
    elif panel_id == "service":
        # recommender does not support services
        return []
        # panels = ["services"]

    async with httpx.AsyncClient() as client:
        r = await client.post(
            RECOMMENDER_ENDPOINT,
            json={
                "user_id": session.aai_id,
                "unique_id": session.session_uuid,
                "timestamp": datetime.datetime.utcnow().isoformat()[:-3] + "Z",
                "visit_id": str(uuid.uuid4()),
                "page_id": page_id,
                "panel_id": panels,
                "candidates": [],
                "search_data": {},
            },
        )

        if r.status_code != 200:
            return []

        recommendation_data = r.json()
        # If the recommender is down stub below might be used for testing
        # recommendation_data = [
        #     {
        #         "pannel_name": "publications",
        #         "recommendations": [
        #             "50|dedup_wf_001::0c6134ef5a88b7434b9243b3dfc5b9a0",
        #             "50|dedup_wf_001::23d748cb81e10f9236042a2fc7b3e4f7",
        #             "50|dedup_wf_001::2408d826182c3cc75c92c74d2db166c1",
        #         ],
        #         "explanations": [
        #             "Publications similar to services previously visited by you.",
        #             "Publications similar to services previously visited by you.",
        #             "Publications similar to services previously visited by you.",
        #         ],
        #         "explanations_short": [
        #             "Previously you visited a similar services.",
        #             "Previously you visited a similar services.",
        #             "Previously you visited a similar services.",
        #         ],
        #     }
        # ]

        if len(recommendation_data) != 1:
            return []

        id_fq = recommendation_data[0]["recommendations"]
        id_fq = " OR ".join([f'"{id}"' for id in id_fq])

        r = await client.post(
            f"{SOLR_URL}all_collection/select",
            json={
                "params": {
                    "defType": "edismax",
                    "q": "*",
                    "qf": ["title", "description"],
                    "fq": [f"id:({id_fq})"],
                    "rows": 3,
                    "wt": "json",
                }
            },
        )

        if r.status_code != 200:
            return []
        return r.json()["response"]["docs"]
