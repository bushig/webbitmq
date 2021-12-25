import asyncio

from fastapi.testclient import TestClient

from webbit.db.models import RabbitServer


def test_create_server_saved_to_db(client: TestClient, event_loop: asyncio.AbstractEventLoop):  # nosec
    response = client.post("/api/management/servers",
                           json={
                               "host": "test.com",
                               "name": "server_name",
                               "password": "pass123"
                           })
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    server_id = data["id"]

    async def get_server_by_db():
        server = await RabbitServer.get(id=server_id)
        return server

    server_obj = event_loop.run_until_complete(get_server_by_db())
    assert server_obj.id == server_id

# TODO: pytest async test + make fixtures for common stuff  + use parametrize here
def test_get_server_list_no_secret_fields(client: TestClient, event_loop: asyncio.AbstractEventLoop):  # nosec

    async def create_server_in_db():
        server = await RabbitServer.create(name="test server", host="localhost", password="pass1word", port=24115)
        return server

    event_loop.run_until_complete(create_server_in_db())


    response = client.get("/api/management/servers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert "password" not in data[0]
