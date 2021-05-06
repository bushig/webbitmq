from fastapi import APIRouter

from webbit.api.routers.rabbit import queue, server

router = APIRouter()
router.include_router(server.router, tags=["management"], prefix="/server")
router.include_router(queue.router, tags=["executor"], prefix="/queue")

