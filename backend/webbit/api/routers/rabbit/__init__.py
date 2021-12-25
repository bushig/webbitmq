from fastapi import APIRouter

from webbit.api.routers.rabbit import queue

router = APIRouter()
router.include_router(queue.router, tags=["executor"], prefix="/queues")

