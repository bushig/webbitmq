import uuid

import json
from typing import List

from redis import asyncio as aioredis
from fastapi import APIRouter, BackgroundTasks, HTTPException
from datetime import datetime, timedelta, timezone

from webbit.core.rabbit import execute_drain_from_rabbit, check_if_all_exchanges_exist

from webbit.core.config import REDIS_URL
from webbit.db.models import RabbitQueue, RabbitServer, RabbitQueueReadSchema, RabbitQueueListSchema, QueueBindings
from webbit.schemas.queue import RabbitQueueCreateSchema, RabbitQueueDetailSchema

router = APIRouter()


# TODO: decide on pagination and make it. for now it get all at once
# TODO: write tests
@router.get("/{queue_id}/messages")
async def get_messages(queue_id: str, page: int = 1, page_size: int = 50):
    # start = (page-1) * page_size
    redis = await aioredis.from_url(
        REDIS_URL, encoding="utf-8")
    res = await redis.lrange(queue_id, start=0, end=-1)
    return [json.loads(msg) for msg in res]


# TODO: add pagination
@router.get("/", response_model=List[RabbitQueueListSchema])
async def get_queues_list(
        server_id: int,
        only_active: bool = False
):
    """
    Get list of available queues
    """

    return await RabbitQueueListSchema.from_queryset(
        RabbitQueue.filter(
            rabbit_server__id=server_id
        ).order_by('-starts_at')
    )


@router.post("/")
async def create_queue(
        data: RabbitQueueCreateSchema,
        background_tasks: BackgroundTasks,
):
    """
    Creates new queue and starts consumption
    """
    rabbit_server = await RabbitServer.get(id=data.rabbit_server_id)
    exchanges_list = [binding.exchange for binding in data.bindings]
    missing_exchanges = await check_if_all_exchanges_exist(rabbit_server, exchanges_list)
    if missing_exchanges:
        raise HTTPException(status_code=400, detail=f"Missing exchanges: {missing_exchanges}")
    queue_uuid = uuid.uuid4()
    now = datetime.now(tz=timezone.utc)
    expires_at = now + timedelta(minutes=data.ttl_minutes)

    queue = await RabbitQueue.create(
        uuid=queue_uuid, rabbit_server_id=rabbit_server.id, starts_at=now,
        expires_at=expires_at
    )
    queue_bindings = [QueueBindings(queue=queue, exchange_name=binding.exchange, routing_key=binding.routing_key) for
              binding in data.bindings]
    await QueueBindings.bulk_create(queue_bindings)

    task_kwargs = {
        "queue_uuid": str(queue_uuid),
        "ttl_minutes": data.ttl_minutes

    }
    # TODO: before creating queue, check if exchange exists and connectible
    background_tasks.add_task(
        execute_drain_from_rabbit,
        **task_kwargs
    )
    return {
        "uuid": queue_uuid
    }


@router.get("/{queue_id}", response_model=RabbitQueueReadSchema)
async def get_queue_meta_data(queue_id: str):
    """
    Get meta info of rabbitmq queue
    """
    rabbit_queue = await RabbitQueue.get(uuid=queue_id).prefetch_related("bindings", "rabbit_server")
    return rabbit_queue
