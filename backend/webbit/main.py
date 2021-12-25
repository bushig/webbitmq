from fastapi import FastAPI, WebSocket
import uvicorn
import aioredis
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
        redis = await aioredis.create_redis_pool(
            'redis://redis', encoding="utf-8")
        await websocket.accept()
        while True:
            res = await redis.subscribe(queue_id)
            channel = res[0]
            while await channel.wait_message():
                msg = await channel.get_json()
                await websocket.send_text(msg)

    return application


app = create_app()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888, ws="websockets")
