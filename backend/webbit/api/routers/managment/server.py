import uuid

import json
from typing import List

from redis import asyncio as aioredis
from fastapi import APIRouter, BackgroundTasks, HTTPException, Response
from datetime import datetime, timedelta, timezone

from starlette.status import HTTP_204_NO_CONTENT

from webbit.core.rabbit import connect_to_rabbit_server
from webbit.db.models import RabbitServerSchema, RabbitServer, RabbitServerCreateSchema, RabbitServerReadSchema

router = APIRouter()


@router.post("/")
async def create_server(server_info: RabbitServerCreateSchema):
    result = await RabbitServer.create(**server_info.dict(exclude_unset=True))
    return {"id": result.id}

@router.post("/{server_id}/check_connection")
async def check_connection_to_server(server_id: int):
    """checks if there is connection to server"""
    server_info = await RabbitServer.get(id=server_id)
    try:
        connection = await connect_to_rabbit_server(server_info)
    except Exception as e:
        return {"ok": False, "error": str(e)}
    # result = await connection.channel()
    return {"ok": True}


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
