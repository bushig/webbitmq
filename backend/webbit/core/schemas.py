from pydantic import BaseModel, Field
from typing import Optional

class RabbitQueueCreateSchema(BaseModel):
    rabbit_server_id: int
    exchange_name: str
    routing_key: Optional[str] = "*"
    ttl_minutes: int = Field(description='time to live in minutes')


class QueueMeta(BaseModel):
    ttl: int
    routing_key: str
    exchange_name: str
    rabbit_host: str
    since: str
    to: str
