import uuid

import json
import aioredis
from fastapi import APIRouter, BackgroundTasks, HTTPException
from datetime import datetime, timedelta, timezone

from webbit.core.schemas import RabbitData, QueueMeta

from webbit.db.models import RabbitServer_Pydantic, RabbitServer

server_managment_router = APIRouter()


@server_managment_router.post("/server", response_model=RabbitServer_Pydantic)
async def create_server(server_info: RabbitServer_Pydantic):
    result = await RabbitServer.create(**server_info.dict(exclude_unset=True))
    return await RabbitServer_Pydantic.from_tortoise_orm(result)

