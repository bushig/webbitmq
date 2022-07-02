from typing import List

from starlette.config import Config
from starlette.datastructures import CommaSeparatedStrings, Secret

VERSION = "0.0.1"

config = Config(".env")

DEBUG: bool = config("DEBUG", cast=bool, default=False)

DATABASE_URL: str = config("DB_CONNECTION", cast=str)
MAX_CONNECTIONS_COUNT: int = config("MAX_CONNECTIONS_COUNT", cast=int, default=10)
MIN_CONNECTIONS_COUNT: int = config("MIN_CONNECTIONS_COUNT", cast=int, default=10)

SECRET_KEY: Secret = config("SECRET_KEY", cast=Secret, default="SECRET")

PROJECT_NAME: str = config("PROJECT_NAME", default="webbitmq")
ALLOWED_HOSTS: List[str] = config(
    "ALLOWED_HOSTS",
    cast=CommaSeparatedStrings,
    default="",
)

WEBBIT_QUEUES_PREFIX = "webbit_"

REDIS_URL: str = config("REDIS_URL", default="redis://redis")


