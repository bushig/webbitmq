from tortoise.models import Model
from tortoise import fields, Tortoise
from tortoise.contrib.pydantic import pydantic_model_creator, pydantic_queryset_creator


class RabbitServer(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=125)
    host = fields.CharField(max_length=255)
    password = fields.CharField(max_length=255)  # TODO: Think about encrypting secure data (SQLCipher?)
    port = fields.IntField()
    vhost = fields.CharField(max_length=255, null=True)

    created_at = fields.DatetimeField(auto_now_add=True)
    modified_at = fields.DatetimeField(auto_now=True)

    def __str__(self):
        return self.name


RabbitServerSchema = pydantic_model_creator(RabbitServer, name="RabbitServer")
RabbitServerCreateSchema = pydantic_model_creator(RabbitServer, name="RabbitServerCreate", exclude=('id',"created_at", "modified_at"))
RabbitServerPublicSchema = pydantic_model_creator(RabbitServer, name="RabbitServer", exclude=("password",))
