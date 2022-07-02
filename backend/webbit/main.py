from fastapi import FastAPI, WebSocket
import uvicorn
from redis import asyncio as aioredis
from tortoise.contrib.fastapi import register_tortoise

from webbit.core import config

from webbit.api.routers.api import router
from webbit.core.config import DATABASE_URL
from webbit.core.consts import MODELS_MODULE


def create_app() -> FastAPI:
    application = FastAPI(
        title=config.PROJECT_NAME, docs_url="/api/docs", openapi_url="/api"
    )
    register_tortoise(
        application,
        db_url=DATABASE_URL,
        modules={"models": [MODELS_MODULE]},
        generate_schemas=True,
        add_exception_handlers=True,
    )

    # Routers
    application.include_router(
        router,
        prefix="/api",
    )

    @application.websocket("/ws/{queue_id}")
    async def websocket_endpoint(websocket: WebSocket, queue_id: str):
        redis = await aioredis.from_url(
            'redis://redis', encoding="utf-8")
        pubsub = redis.pubsub()
        await pubsub.subscribe(queue_id)
        await websocket.accept()

        # TODO: restrict connection if queue is dead
        # TODO: connection is not terminated properly on disconnect
        # await websocket.send_text("connected")

        async for message in pubsub.listen():
            if message["type"] == "subscribe":
                continue
            # TODO: break connection on drain end
            print("message", message)
            text_data = message["data"].decode("utf-8")
            await websocket.send_text(text_data)


    return application


app = create_app()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888, ws="websockets")
