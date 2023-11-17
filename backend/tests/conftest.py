import asyncio
from typing import Generator, AsyncGenerator

import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient
from tortoise import Tortoise

from tortoise.contrib.test import initializer, finalizer

from tests.client import AsyncTestClient
from webbit.core.consts import MODELS_MODULE
from webbit.main import app
from asgi_lifespan import LifespanManager


@pytest.fixture(scope="module", autouse=True)
async def client(anyio_backend) -> AsyncGenerator[AsyncTestClient, None]:
    # loop = asyncio.get_running_loop()
    async with LifespanManager(app):
        # await initializer([MODELS_MODULE], loop=loop)
        async with AsyncTestClient(app=app, base_url="http://test") as c:
            yield c
        await Tortoise._drop_databases()
        # await finalizer(loop=loop)


@pytest.fixture(scope="module")
def anyio_backend() -> str:
    return 'asyncio'
