from contextlib import suppress

import aioredis
import aio_pika
import json
from datetime import datetime, timezone

import asyncio
from webbit.core.config import RABBITS_URLS


async def execute_drain_from_rabbit(
    rabbit_env: str,
    exchange_name: str,
    routing_key: str,
    key: str,
    ttl: int
):
    """
    Drains messages from rabbit exchange, using self-destruction queue.
    :param rabbit_env: Rabbit's environment
    :param exchange_name: Name of exchange to gain data
    :param key: connection key
    :param routing_key: Routing key to bind, all by default
    :param ttl: Time of queue's life
    """
    connection = await aio_pika.connect(
        RABBITS_URLS[rabbit_env]
    )
    async with connection:
        channel = await connection.channel()
        exchange = await channel.get_exchange(exchange_name)
        queue = await channel.declare_queue(key, auto_delete=True)
        await queue.bind(exchange, routing_key=routing_key)
        with suppress(asyncio.exceptions.TimeoutError):
            await asyncio.wait_for(drain(queue), timeout=ttl * 60.0)


async def drain(queue):
    redis = await aioredis.create_redis_pool(
        'redis://redis', encoding="utf-8")
    async with queue.iterator() as queue_iter:
        async for message in queue_iter:
            async with message.process():
                msg_body = json.dumps({
                    "payload": message.body.decode("utf8"),
                    "timestamp": datetime.now(tz=timezone.utc).isoformat(),
                    "routing_key": message.routing_key
                })
                await redis.lpush(queue.name, msg_body)
                await redis.publish_json(queue.name, msg_body)
