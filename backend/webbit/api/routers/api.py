from fastapi import APIRouter

from webbit.api.routers.rabbit import router as rabbit_router
from webbit.api.routers.managment import router as managment_router

router = APIRouter()
router.include_router(rabbit_router, tags=["rabbitmq"], prefix="/rabbit")
router.include_router(managment_router, tags=["management"], prefix="/management")

