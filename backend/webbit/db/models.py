from tortoise import Tortoise, fields
from tortoise.contrib.pydantic import pydantic_model_creator
from tortoise.models import Model
from tortoise.validators import MaxValueValidator, MinValueValidator

from webbit.core.consts import MODELS_MODULE


class RabbitServer(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=125)
    host = fields.CharField(max_length=255)
    username = fields.CharField(max_length=255)  # TODO: Think about encrypting secure data (SQLCipher?)
    password = fields.CharField(max_length=255)  # TODO: Think about encrypting secure data (SQLCipher?)
    port = fields.IntField(validators=[MinValueValidator(1), MaxValueValidator(65535)])
    vhost = fields.CharField(max_length=255, null=True, default="/")

    created_at = fields.DatetimeField(auto_now_add=True)
    modified_at = fields.DatetimeField(auto_now=True)

    queues: fields.ReverseRelation["RabbitQueue"]

    def __str__(self):
        return f"RabbitServer {self.name}"


class RabbitQueue(Model):
    uuid = fields.UUIDField(pk=True)
    messages_type = fields.CharField(max_length=5, default="json")  # how we should parse messages

    rabbit_server: fields.ForeignKeyRelation[RabbitServer] = fields.ForeignKeyField(
        "models.RabbitServer",
        related_name="queues",
    )

    starts_at = fields.DatetimeField()
    expires_at = fields.DatetimeField()

    bindings: fields.ReverseRelation["QueueBindings"]

    # modified_at = fields.DatetimeField(auto_now=True)

    def base_rabbit_admin_url(self) -> str:
        return f"http://{self.rabbit_server.host}:15672/#"

    def queue_name(self) -> str:
        """Returns queue name for RabbitMQ"""
        return f"webbit_{self.uuid}"

    def rabbit_server_id(self) -> int:
        """Returns queue name for RabbitMQ"""
        return self.rabbit_server__id

    # class PydanticMeta:
    #     computed = ["rabbit_server_id"]

    def __str__(self):
        return f"RabbitQueue {self.uuid}"

    class Meta:
        # index for list
        indexes = (("rabbit_server_id", "starts_at"),)


class QueueBindings(Model):
    """Bindings of queue to exchange"""

    queue: fields.ForeignKeyRelation[RabbitQueue] = fields.ForeignKeyField(
        "models.RabbitQueue", related_name="bindings"
    )
    routing_key = fields.CharField(max_length=80)
    exchange_name = fields.CharField(max_length=80)

    class PydanticMeta:
        exclude = ["id"]


Tortoise.init_models([MODELS_MODULE], "models")


RabbitServerSchema = pydantic_model_creator(RabbitServer, name="RabbitServer", exclude=("queues",))
RabbitServerCreateSchema = pydantic_model_creator(
    RabbitServer,
    name="RabbitServerCreate",
    exclude=(
        "id",
        "created_at",
        "modified_at",
        "queues",
    ),
)
RabbitServerReadSchema = pydantic_model_creator(
    RabbitServer,
    name="RabbitServerRead",
    exclude=(
        "password",
        "queues",
    ),
)

RabbitQueueSchema = pydantic_model_creator(RabbitQueue, name="RabbitQueue")
RabbitQueueReadSchema = pydantic_model_creator(
    RabbitQueue,
    name="RabbitQueueRead",
    exclude=("rabbit_server",),
    computed=("base_rabbit_admin_url", "queue_name"),
)
RabbitQueueListSchema = pydantic_model_creator(RabbitQueue, name="RabbitQueueList", computed=("rabbit_server_id",))
