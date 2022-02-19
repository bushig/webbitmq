import uuid

import json
import aioredis
from fastapi import APIRouter, BackgroundTasks, HTTPException
from datetime import datetime, timedelta, timezone

from webbit.core.rabbit import execute_drain_from_rabbit
from webbit.core.schemas import QueueMeta, RabbitQueueCreateSchema

from webbit.core.config import RABBITS_MANAGE_URLS, REDIS_URL
from webbit.db.models import RabbitQueue, RabbitServer

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


@router.post("/")
async def create_queue(
        data: RabbitQueueCreateSchema,
        background_tasks: BackgroundTasks,
):
    """
    Creates new queue and starts consumption
    """
    queue_uuid = uuid.uuid4()
    now = datetime.now(tz=timezone.utc)
    expires_at = now + timedelta(minutes=data.ttl_minutes)
    rabbit_server = await RabbitServer.get(id=data.rabbit_server_id)
    queue = await RabbitQueue.create(uuid=queue_uuid, rabbit_server_id=rabbit_server.id, starts_at=now, expires_at=expires_at, routing_key=data.routing_key, exchange_name=data.exchange_name)

    task_kwargs = {
        "uuid": queue_uuid,

    }
    background_tasks.add_task(
        execute_drain_from_rabbit,
        **data,
        key=key
    )
    return {
        "uuid": queue_uuid
    }

@router.get("/{queue_id}", response_model=QueueMeta)
async def get_queue_meta_data(queue_id: str):
    """
    Get meta info of rabbitmq queue
    """
    rabbit_queue = await RabbitQueue.get(uuid=queue_id)
    return rabbit_queue
