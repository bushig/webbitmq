from fastapi import APIRouter

from webbit.api.routers.rabbit.queue import router as queue_router

router = APIRouter()
router.include_router(queue_router, tags=["executor"], prefix="/queues")

