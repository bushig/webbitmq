from tortoise.models import Model
from tortoise import fields, Tortoise
from tortoise.validators import MaxValueValidator, MinValueValidator
from tortoise.contrib.pydantic import pydantic_model_creator, pydantic_queryset_creator


class RabbitServer(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=125)
    host = fields.CharField(max_length=255)
    username = fields.CharField(max_length=255)  # TODO: Think about encrypting secure data (SQLCipher?)
    password = fields.CharField(max_length=255)  # TODO: Think about encrypting secure data (SQLCipher?)
    port = fields.IntField(validators=[MinValueValidator(1), MaxValueValidator(65535)])
    vhost = fields.CharField(max_length=255, null=True, default=None)

    created_at = fields.DatetimeField(auto_now_add=True)
    modified_at = fields.DatetimeField(auto_now=True)

    queues: fields.ReverseRelation["RabbitQueue"]

    def __str__(self):
        return f"RabbitServer {self.name}"

class RabbitQueue(Model):
    uuid = fields.UUIDField(pk=True)
    messages_type = fields.CharField(max_length=5, default="json") # how we should parse messages
    routing_key = fields.CharField(max_length=80)  # TODO: should be list of exchanges and routing keys?
    exchange_name = fields.CharField(max_length=80)
    rabbit_server: fields.ForeignKeyRelation[RabbitServer] = fields.ForeignKeyField(
        "models.RabbitServer",
        related_name="queues"
    )

    starts_at = fields.DatetimeField()
    expires_at = fields.DatetimeField()

    # modified_at = fields.DatetimeField(auto_now=True)

    def __str__(self):
        return f"RabbitQueue {self.uuid}"


RabbitServerSchema = pydantic_model_creator(RabbitServer, name="RabbitServer")
RabbitServerCreateSchema = pydantic_model_creator(RabbitServer, name="RabbitServerCreate", exclude=('id',"created_at", "modified_at"))
RabbitServerReadSchema = pydantic_model_creator(RabbitServer, name="RabbitServerRead", exclude=("password",))


RabbitQueueSchema = pydantic_model_creator(RabbitQueue, name="RabbitQueue")
RabbitQueueReadSchema = pydantic_model_creator(RabbitQueue, name="RabbitQueueCreate", include=("uuid", "exchange_name", "rabbit_server"))