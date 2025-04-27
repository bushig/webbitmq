from typing import List

from fastapi import APIRouter, Response, status

from webbit.core.rabbit import connect_to_rabbit_server
from webbit.db.models import (
    RabbitServer,
    RabbitServerCreateSchema,
    RabbitServerReadSchema,
)

router = APIRouter()


@router.post("/")
async def create_server(server_info: RabbitServerCreateSchema):
    result = await RabbitServer.create(**server_info.dict(exclude_unset=True))
    return {"id": result.id}


@router.post("/{server_id}/check_connection")
async def check_connection_to_server(server_id: int, response: Response):
    """checks if there is connection to server"""
    server_info = await RabbitServer.get(id=server_id)
    try:
        await connect_to_rabbit_server(server_info)
    except Exception as e:
        response.status_code = status.HTTP_424_FAILED_DEPENDENCY
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


@router.delete("/{server_id}", response_model=None, status_code=status.HTTP_204_NO_CONTENT)
async def delete_server(server_id: int):
    server = await RabbitServer.get(id=server_id)
    await server.delete()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
