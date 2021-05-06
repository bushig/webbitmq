import uuid

import json
import aioredis
from fastapi import APIRouter, BackgroundTasks, HTTPException
from datetime import datetime, timedelta, timezone

from webbit.core.rabbit import execute_drain_from_rabbit
from webbit.core.schemas import RabbitData, QueueMeta

from webbit.core.config import RABBITS_MANAGE_URLS

router = APIRouter()


@router.get("/{queue_id}/messages")
async def messages(queue_id: str):
    redis = await aioredis.create_redis_pool(
        'redis://redis', encoding="utf-8")
    res = await redis.lrange(queue_id, 0, -1)
    return [json.loads(msg) for msg in res]


@router.post("/execute_drain")
async def execute_drain(
        rabbit_data: RabbitData,
        background_tasks: BackgroundTasks,
):
    """
    Executes drain process.
    """
    key = str(uuid.uuid4())
    data = rabbit_data.dict()
    redis = await aioredis.create_redis_pool(
        'redis://redis', encoding="utf-8")
    now = datetime.now(tz=timezone.utc)
    to = now + timedelta(minutes=data["ttl"])
    meta = {
        "ttl": data["ttl"],
        "routing_key": data["routing_key"],
        "exchange_name": data["exchange_name"],
        "rabbit_host": RABBITS_MANAGE_URLS.get(data["rabbit_env"]),
        "since": now.isoformat(),
        "to": to.isoformat(),
    }
    await redis.set(f"{key}-meta", json.dumps(meta, ensure_ascii=False))
    background_tasks.add_task(
        execute_drain_from_rabbit,
        **data,
        key=key
    )
    return {
        "key": key
    }


@router.get("/get_meta/{key}", response_model=QueueMeta)
async def get_meta_info(key: str):
    """
    Get meta info.
    """
    redis = await aioredis.create_redis_pool('redis://redis', encoding="utf-8")
    result: str = await redis.get(f"{key}-meta")
    if result:
        return json.loads(result)
    raise HTTPException(status_code=404, detail="Meta Not Found")
