import pytest
from fastapi.testclient import TestClient

from tests.client import AsyncTestClient
from tests.utils.db import create_server_in_db
from webbit.db.models import RabbitServer

# TODO: доделать тесты с параметрайзом

@pytest.mark.anyio
async def test_create_server_api(client: AsyncTestClient, valid_server):  # nosec
    """
    Server is created and can be connected to
    """
    server_id = valid_server["id"]
    # TODO: move to client
    response = await client.check_server_connection(server_id)

@pytest.mark.anyio
async def test_invalid_server_fails_to_connect(client: AsyncTestClient):  # nosec
    """
    Server is created and can be connected to
    """
    response = await client.create_server({
                               "host": "nonhost", # nonexistent host
                               "name": "server_name",
                               "username": "guest",
                               "password": "guest",
                               "port": 5672
                           })
    server_id = response["id"]
    response = await client.check_server_connection(server_id)
    data = response.json()
    assert "id" in data


# TODO: pytest async test + make fixtures for common stuff  + use parametrize here
@pytest.mark.anyio
async def test_get_server_list_no_secret_fields(client):  # nosec

    await create_server_in_db()


    response = await client.get("/api/management/servers/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert "password" not in data[0]
