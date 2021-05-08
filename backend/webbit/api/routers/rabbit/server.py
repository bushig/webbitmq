import uuid

import json
from typing import List

import aioredis
from fastapi import APIRouter, BackgroundTasks, HTTPException
from datetime import datetime, timedelta, timezone

from webbit.core.schemas import RabbitData, QueueMeta

from webbit.db.models import RabbitServerSchema, RabbitServer, RabbitServerCreateSchema

router = APIRouter()


@router.post("/")
async def create_server(server_info: RabbitServerCreateSchema):
    result = await RabbitServer.create(**server_info.dict(exclude_unset=True))
    return {"id": result.id}

@router.get("/", response_model=List[RabbitServerSchema])
async def get_servers_list():
    results = RabbitServer.all()
    return await RabbitServerSchema.from_queryset(results)
#
# @router.get("/", response_model=List[RabbitServerSchema])
# async def get_servers_list():
#     results = await RabbitServer.get()
#     return await RabbitServerSchema.from_tortoise_orm(results)