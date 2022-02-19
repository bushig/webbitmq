from typing import Generator

import pytest
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


@pytest.fixture
def anyio_backend() -> str:
    return 'asyncio'
#
# @pytest.fixture
# async def client(initialized_app: FastAPI) -> AsyncClient:
#     async with AsyncClient(
#         app=initialized_app,
#         base_url="http://testserver",
#         headers={"Content-Type": "application/json"},
#     ) as client:
#         yield client
