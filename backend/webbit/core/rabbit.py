from contextlib import suppress

from redis import asyncio as aioredis
import aio_pika
import json
from datetime import datetime, timezone

import asyncio
from webbit.core.config import WEBBIT_QUEUES_PREFIX, REDIS_URL

from webbit.db.models import RabbitQueue, RabbitServer


async def connect_to_rabbit_server(server_info: RabbitServer) -> aio_pika.Connection:
    """
    Creates RabbitMQ connection using database object
    :param server_info:
    :return:
    """
    connection = await aio_pika.connect(
        host=server_info.host,
        ort=server_info.port,
        login=server_info.username,
        password=server_info.password,
        virtualhost=server_info.vhost,

    )
    return connection


# TODO: Run in other process (celery, other?)
async def execute_drain_from_rabbit(
        queue_uuid: str,
        ttl_minutes: int
):
    """
    Drains messages from rabbit exchange, using self-destructible queue.
    :param queue_uuid: Queue data
    :param ttl_minutes: Time of queue's life
    """
    queue_info = await RabbitQueue.get(uuid=queue_uuid).prefetch_related("rabbit_server")
    rabbit_server_info = queue_info.rabbit_server

    connection = await connect_to_rabbit_server(rabbit_server_info)
    async with connection:
        channel = await connection.channel()
        exchange = await channel.get_exchange(queue_info.exchange_name)
        # TODO: handle aio_pika.exceptions.ChannelClosed (no exchange)

        queue = await channel.declare_queue(f"{WEBBIT_QUEUES_PREFIX}{queue_info.uuid}", auto_delete=True)
        await queue.bind(exchange, routing_key=queue_info.routing_key)

        # starting to consume
        with suppress(asyncio.exceptions.TimeoutError):
            await asyncio.wait_for(drain(queue_uuid, queue), timeout=ttl_minutes * 60.0)


async def drain(queue_uuid: str, queue: aio_pika.Queue):
    """
    Takes messages from rabbit and forwards them to redis
    """
    redis = await aioredis.from_url(
        REDIS_URL, encoding="utf-8", decode_responses=True)
    # pubsub = redis.pubsub()
    # await pubsub.subscribe(queue_uuid)
    async with queue.iterator() as queue_iter:
        async for message in queue_iter:
            async with message.process():
                msg_body = json.dumps({
                    "payload": message.body.decode("utf8"),
                    "timestamp": datetime.now(tz=timezone.utc).isoformat(),
                    "routing_key": message.routing_key
                })
                await redis.lpush(queue_uuid, msg_body)
                await redis.publish(queue_uuid, msg_body)
