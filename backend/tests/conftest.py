from typing import AsyncGenerator

import pytest
from asgi_lifespan import LifespanManager
from tortoise import Tortoise

from tests.client import AsyncTestClient
from webbit.main import app


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
    return "asyncio"
