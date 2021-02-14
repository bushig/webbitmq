from fastapi import FastAPI, WebSocket
from starlette.requests import Request
import uvicorn
import aioredis
import asyncio
import json
from app.core import config

from app.api.api_v1.routers.rabbit_handler import rabbit_handler_router

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

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888, ws="websockets")
