from typing import List

from pydantic import BaseModel

from webbit.db.models import RabbitQueueListSchema


class ServerSettings(BaseModel):
    """Settings of application for frontend"""

    can_edit_servers: bool


class QueueListResultSchema(BaseModel):
    queues: List[RabbitQueueListSchema]
    total: int
