from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, Field


class RabbitBindings(BaseModel):
    """Bindings of queue to exchange"""

    exchange: str
    routing_key: str = Field(default="")


class RabbitQueueCreateSchema(BaseModel):
    rabbit_server_id: int
    bindings: List[RabbitBindings] = Field(
        default_factory=list, description="Bindings of queue to exchange", min_items=1
    )
    ttl_minutes: int = Field(description="How long queue should be alive in minutes")


class RabbitQueueDetailSchema(BaseModel):
    uuid: UUID
    rabbit_server_id: int
    bindings: List[RabbitBindings] = Field(
        description="Bindings of queue to exchange", default_factory=list, min_items=1
    )
    starts_at: datetime
    expires_at: datetime
