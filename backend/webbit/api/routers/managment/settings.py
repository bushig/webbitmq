from fastapi import APIRouter

from webbit.core.schemas import ServerSettings

router = APIRouter()


@router.get("/", response_model=ServerSettings)
async def get_settings() -> ServerSettings:
    return ServerSettings(can_edit_servers=True)
