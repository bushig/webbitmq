import asyncio

from fastapi.testclient import TestClient

from webbit.db.models import RabbitServer


def test_create_server_saved_to_db(client: TestClient, event_loop: asyncio.AbstractEventLoop):  # nosec
    response = client.post("/api/rabbit/server",
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
