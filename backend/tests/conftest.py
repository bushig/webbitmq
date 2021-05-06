from typing import Generator

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from fastapi.testclient import TestClient
from tortoise.contrib.test import initializer, finalizer

from webbit.core.consts import MODELS_MODULE
from webbit.main import app


@pytest.fixture(scope="module")
def client() -> Generator:
    initializer([MODELS_MODULE])
    with TestClient(app) as c:
        yield c
    finalizer()


@pytest.fixture(scope="module")
def event_loop(client: TestClient) -> Generator:
    yield client.task.get_loop()
#
# @pytest.fixture
# async def client(initialized_app: FastAPI) -> AsyncClient:
#     async with AsyncClient(
#         app=initialized_app,
#         base_url="http://testserver",
#         headers={"Content-Type": "application/json"},
#     ) as client:
#         yield client
