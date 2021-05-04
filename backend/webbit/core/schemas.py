from pydantic import BaseModel
import typing as t


class RabbitData(BaseModel):
    rabbit_env: str
    exchange_name: str
    routing_key: t.Optional[str] = "*"
    ttl: int


class QueueMeta(BaseModel):
    ttl: int
    routing_key: str
    exchange_name: str
    rabbit_host: str
    since: str
    to: str
