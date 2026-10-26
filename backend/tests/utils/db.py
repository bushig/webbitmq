from webbit.db.models import RabbitServer


async def create_server_in_db():
    server = await RabbitServer.create(
        name="test server",
        host="localhost",
        password="pass1word",
        username="admin",
        port=24115,
    )
    return server
