import asyncio
import logging
from typing import List, Dict

from fastapi import FastAPI, WebSocket
import uvicorn
from redis import asyncio as aioredis
from starlette.endpoints import WebSocketEndpoint
from tortoise.contrib.fastapi import register_tortoise

from webbit.core import config

from webbit.api.routers.api import router
from webbit.core.config import DATABASE_URL, REDIS_URL
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



    @application.websocket_route("/ws/{queue_id}")
    class Echo(WebSocketEndpoint):
        encoding = "text"

        async def on_connect(self, websocket, *args, **kwargs):
            queue_id = websocket.path_params["queue_id"]
            redis = application.state.redis
            self._pubsub = redis.pubsub()

            await self._pubsub.subscribe(queue_id)
            await websocket.accept()
            # await websocket.send_text("connected")
            self.consumer_task = asyncio.create_task(self.consume_events(websocket))

        async def consume_events(self, websocket: WebSocket) -> None:
            logging.debug("service send_heartbeat IN")
            async for message in self._pubsub.listen():
                if message["type"] == "subscribe":
                    continue
                # TODO: break connection on drain end
                # print("message", message)
                text_data = message["data"].decode("utf-8")
                await websocket.send_text(text_data)

        async def on_disconnect(self, websocket, close_code):
            self.consumer_task.cancel()
            print("websocket disconnected")


    # @application.websocket("/ws/{queue_id}")
    # async def websocket_endpoint(websocket: WebSocket, queue_id: str):
    #     redis = await aioredis.from_url(
    #         'redis://redis', encoding="utf-8")
    #     pubsub = redis.pubsub()
    #     await pubsub.subscribe(queue_id)
    #     await websocket.accept()
    #
    #     # TODO: restrict connection if queue is dead
    #     # TODO: connection is not terminated properly on disconnect
    #     # await websocket.send_text("connected")
    #
    #     async for message in pubsub.listen():
    #         if message["type"] == "subscribe":
    #             continue
    #         # TODO: break connection on drain end
    #         print("message", message)
    #         text_data = message["data"].decode("utf-8")
    #         await websocket.send_text(text_data)
    #
    #
    return application


app = create_app()

@app.on_event('startup')
async def startup_event():
    # global redis_without_decode
    # global redis_with_decode
    # loop = asyncio.get_event_loop()
    app.state.redis = await aioredis.from_url(
        REDIS_URL, encoding="utf-8")

# @application.on_event('shutdown')
# async def shutdown_event():
#     application.state.redis.close()
#     await application.state.redis.wait_closed()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888, ws="websockets")
