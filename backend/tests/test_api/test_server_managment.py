import pytest
from fastapi.testclient import TestClient

from webbit.db.models import RabbitServer

# TODO: доделать тесты с параметрайзом

@pytest.mark.anyio
# @pytest.mark.parametrize("test_input,expected", [("3+5", 8), ("2+4", 6), ("6*9", 42)])
async def test_create_server_api(client: TestClient):  # nosec
    response = client.post("/api/management/servers/",
                           json={
                               "host": "test.com",
                               "name": "server_name",
                               "password": "pass123",
                               "port": 1041
                           })
    assert response.status_code == 200
    data = response.json()
    assert "id" in data


# TODO: pytest async test + make fixtures for common stuff  + use parametrize here
@pytest.mark.anyio
async def test_get_server_list_no_secret_fields(client: TestClient):  # nosec

    async def create_server_in_db():
        server = await RabbitServer.create(name="test server", host="localhost", password="pass1word", port=24115)
        return server

    create_server_in_db()


    response = client.get("/api/management/servers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert "password" not in data[0]
