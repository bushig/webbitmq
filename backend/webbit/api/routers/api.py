from fastapi import APIRouter

from webbit.api.routers.rabbit import router as rabbit_router

router = APIRouter()
router.include_router(rabbit_router, tags=["rabbitmq"], prefix="/rabbit")

