from fastapi import APIRouter

from webbit.api.routers.managment import server, settings

router = APIRouter()
router.include_router(server.router, tags=["management"], prefix="/servers")
router.include_router(settings.router, tags=["settings"], prefix="/settings")
