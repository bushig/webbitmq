from fastapi import APIRouter

from webbit.api.routers.managment import server

router = APIRouter()
router.include_router(server.router, tags=["management"], prefix="/servers")



