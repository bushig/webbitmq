import uuid

import json
from typing import List

import aioredis
from fastapi import APIRouter, BackgroundTasks, HTTPException, Response
from datetime import datetime, timedelta, timezone

from starlette.status import HTTP_204_NO_CONTENT

from webbit.db.models import RabbitServerSchema, RabbitServer, RabbitServerCreateSchema, RabbitServerReadSchema

router = APIRouter()


@router.post("/")
async def create_server(server_info: RabbitServerCreateSchema):
    result = await RabbitServer.create(**server_info.dict(exclude_unset=True))
    return {"id": result.id}


@router.get("/", response_model=List[RabbitServerReadSchema])
async def get_servers_list():
    results = RabbitServer.all()
    return await RabbitServerReadSchema.from_queryset(results)

@router.get("/{server_id}", response_model=RabbitServerReadSchema)
async def get_server_info(server_id: int):
    results = await RabbitServer.get(id=server_id)
    return await RabbitServerReadSchema.from_tortoise_orm(results)


@router.delete("/{server_id}", response_model=None, status_code=HTTP_204_NO_CONTENT)
async def delete_server(server_id: int):
    server = await RabbitServer.get(id=server_id)
    await server.delete()
    return Response(status_code=HTTP_204_NO_CONTENT)
