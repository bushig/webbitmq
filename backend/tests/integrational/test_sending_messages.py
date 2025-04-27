import pytest

from tests.utils.db import create_server_in_db

# TODO: complete tests with parametrize


@pytest.mark.anyio
# @pytest.mark.parametrize("test_input,expected", [("3+5", 8), ("2+4", 6), ("6*9", 42)])
async def test_sending_messages_work(client):  # nosec
    # creating server TODO: move somewhere else as fixture
    response = await client.post(
        "/api/management/servers/",
        json={
            "host": "rabbit",
            "name": "server_name",
            "username": "guest",
            "password": "guest",
            "port": 5672,
        },
    )
    assert response.status_code == 200
    # data = response.json()
    # server_id = data["id"]

    # creating queue TODO: move somewhere else as fixture


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
