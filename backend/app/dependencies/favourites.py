"""Favourites-specific dependencies"""

import logging
from typing import Literal, AsyncGenerator

import httpx

from app.settings import settings
from fastapi import APIRouter, Depends, HTTPException, Request

from app.utils.cookie_validators import verifier, cookie

logger = logging.getLogger(__name__)

class FavouritesClient:
    def __init__(self, url: str, httpx_client: httpx.AsyncClient):
        self.url = url
        self.client = httpx_client

    async def get_fav(self, token) -> list[dict]:
        response = await self.client.get(
            self.url,
            headers={"Authorization" : f"Bearer {token}"},
            params={}
        )
        response.raise_for_status()
        return response.json()

    async def add_fav(self,
        token: str,
        pid: str,
        resource_type: Literal[
            "adapter",
            "service",
            "publication",
            "dataset",
            "training",
            "software",
            "data source",
            "data-source",
            "other",
            "guideline",
            "bundle",
            "provider",
            "project",
            "organisation",
            "catalogue",
            "deployable service",
            "deployable-service",
        ]) -> dict:
        response = await self.client.post(
            self.url,
            headers={"Authorization" : f"Bearer {token}"},
            json={
                "pid": pid,
                "resource_type": resource_type
            },
        )
        response.raise_for_status()
        return response.json()

    async def remove_fav(self,
        token: str,
        pid: str,
        resource_type: Literal[
            "adapter",
            "service",
            "publication",
            "dataset",
            "training",
            "software",
            "data source",
            "data-source",
            "other",
            "guideline",
            "bundle",
            "provider",
            "project",
            "organisation",
            "catalogue",
            "deployable service",
            "deployable-service",
        ]) -> None:
        response = await self.client.delete(
            self.url,
            headers={"Authorization" : f"Bearer {token}"},
            params={
                "pid": pid,
                "resource_type": resource_type
            },
        )
        response.raise_for_status()
        return response.json()


async def get_favourites_client() -> AsyncGenerator[FavouritesClient, None]:

    async with httpx.AsyncClient(timeout=100.0) as client:
        yield FavouritesClient(
            url=settings.FAVOURITE_API_URL,
            httpx_client=client
        )



