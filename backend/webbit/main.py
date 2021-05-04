from fastapi import FastAPI, WebSocket
import uvicorn
import aioredis
from tortoise.contrib.fastapi import register_tortoise

from webbit.core import config

from webbit.api.routers.rabbit.rabbit_handler import rabbit_handler_router

app = FastAPI(
    title=config.PROJECT_NAME, docs_url="/api/docs", openapi_url="/api"
)


@app.websocket("/ws/{queue_id}")
async def websocket_endpoint(websocket: WebSocket, queue_id: str):
    redis = await aioredis.create_redis_pool(
        'redis://redis', encoding="utf-8")
    await websocket.accept()
    while True:
        res = await redis.subscribe(queue_id)
        channel = res[0]
        while await channel.wait_message():
            msg = await channel.get_json()
            await websocket.send_text(msg)


# Routers
app.include_router(
    rabbit_handler_router,
    prefix="/api",
    tags=["executor"]
)
register_tortoise(
        app,
        db_url="sqlite://db.sqlite3",
        modules={"models": ["webbit.db.models"]},
        generate_schemas=True,
        add_exception_handlers=True,
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888, ws="websockets")
