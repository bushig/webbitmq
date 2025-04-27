import pytest

from tests.client import AsyncTestClient

# from tortoise.contrib.test import initializer, finalizer
#
# from webbit.core.consts import MODELS_MODULE
# from webbit.main import app


@pytest.fixture
async def valid_server(client: AsyncTestClient) -> dict:
    """
    creates valid server in local environment
    """ ""
    response = await client.create_server(
        data={
            "host": "rabbit",
            "name": "server_name",
            "username": "guest",
            "password": "guest",
            "port": 5672,
        }
    )
    return response.json()


@pytest.fixture
async def simple_rabbit_queue(client, valid_server) -> dict:
    """
    creates queue that is valid in local environment
    """ ""
    server_id = valid_server["id"]
    response = await client.post(
        "/api/rabbit/queues/",
        json={
            "rabbit_server_id": server_id,
            "exchange_name": "test_exchange",
            "routing_key": "*",
            "ttl_minutes": 5,
        },
    )
    assert response.status_code == 200
    return response.json()
