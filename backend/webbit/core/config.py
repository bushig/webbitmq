from typing import List

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings

VERSION = "0.0.1"


class Settings(BaseSettings):
    # model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    DEBUG: bool = False

    DB_CONNECTION: str
    MAX_CONNECTIONS_COUNT: int = 10
    MIN_CONNECTIONS_COUNT: int = 10

    SECRET_KEY: SecretStr = Field(default="SECRET")

    PROJECT_NAME: str = "webbitmq"
    ALLOWED_HOSTS: List[str] = Field(default_factory=list)

    WEBBIT_QUEUES_PREFIX: str = "webbit_"

    REDIS_URL: str = "redis://redis"


settings = Settings()

# temporary for backward compatibility
# TODO: remove those
DEBUG: bool = settings.DEBUG
DATABASE_URL: str = settings.DB_CONNECTION
MAX_CONNECTIONS_COUNT: int = settings.MAX_CONNECTIONS_COUNT
MIN_CONNECTIONS_COUNT: int = settings.MIN_CONNECTIONS_COUNT
SECRET_KEY: SecretStr = settings.SECRET_KEY
PROJECT_NAME: str = settings.PROJECT_NAME
ALLOWED_HOSTS: List[str] = settings.ALLOWED_HOSTS
WEBBIT_QUEUES_PREFIX: str = settings.WEBBIT_QUEUES_PREFIX
REDIS_URL: str = settings.REDIS_URL
